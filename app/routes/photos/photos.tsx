import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const POOL_ID = process.env['COGNITO_POOL_ID'];
const REGION = process.env['S3_REGION'];
const BUCKET = process.env['S3_BUCKET'];

const getS3Client = (token?: string) => new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: REGION },
    identityPoolId: POOL_ID ?? '',
    ...(token
      ? {
          logins: {
            [`cognito-idp.${REGION}.amazonaws.com/us-east-1_pA7PzQG2L`]: token,
          },
        }
      : {}),
  }),
});

export async function loader() {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: 'photos/',
    Delimiter: '/',
  });

  try {
    const json = await getS3Client().send(command);
    console.log(json);
  } catch (e) {
    console.error('error', e);
  }
}

export default function Photos() {}
