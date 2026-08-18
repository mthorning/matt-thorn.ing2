import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const POOL_ID = process.env['COGNITO_POOL_ID'];
const REGION = process.env['S3_REGION'];
const BUCKET = process.env['S3_BUCKET'];
const CLOUDFRONT_URL = process.env['CLOUDFRONT_URL'];
const PREFIX = 'photos/';

const getS3Client = (token?: string) =>
  new S3Client({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: REGION },
      identityPoolId: POOL_ID ?? '',
      ...(token
        ? {
            logins: {
              [`cognito-idp.${REGION}.amazonaws.com/us-east-1_pA7PzQG2L`]:
                token,
            },
          }
        : {}),
    }),
  });

const resizeObjects = {
  thumbnail: {
    resize: {
      width: 250,
      height: 250,
      fit: 'cover',
    },
  },
  fullsize: {
    resize: {
      width: 1200,
      height: 1200,
      fit: 'inside',
    },
  },
} as const;

function getImageUrl(
  filename: string,
  resizeObject: keyof typeof resizeObjects
): string {
  const request = {
    bucket: BUCKET,
    key: `${PREFIX}${filename}`,
    edits: resizeObjects ? resizeObjects[resizeObject] : {},
  };

  const str: string = JSON.stringify(request);
  const enc = Buffer.from(str).toString('base64');
  return `${CLOUDFRONT_URL}${enc}`;
}

export type Datum = Record<'fullsizeUrl' | 'thumbUrl' | 'filename', string>;

export async function getImageURLs(): Promise<Datum[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: PREFIX,
    Delimiter: '/',
  });

  try {
    const objects = await getS3Client().send(command);

    const data = objects?.Contents?.reduce<Datum[]>((acc, object) => {
      const filename = object?.Key?.replace(PREFIX, '');

      if (filename) {
        const thumbUrl = getImageUrl(filename, 'thumbnail');
        const fullsizeUrl = getImageUrl(filename, 'fullsize');

        return [...acc, { fullsizeUrl, thumbUrl, filename }];
      }
      return acc;
    }, []);

    return data ?? [];
  } catch (e) {
    throw new Response('Error fetching images', {
      status: 500,
      statusText: 'Server Error',
    });
  }
}
