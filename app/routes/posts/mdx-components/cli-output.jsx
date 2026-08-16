import React from 'react';

const style = {
  display: 'block',
  overflowX: 'auto',
  background: 'var(--base-300)',
  color: 'var(--base-content)',
  padding: '0.5em',
  margin: '24px 0',
};
const errorStyle = {
  border: '0.5em solid #e8111294',
};

export default function CliOutput({ output, error }) {
  return (
    <pre
      className="command-line"
      style={{
        ...style,
        ...(error ? errorStyle : {}),
      }}
    >
      {output}
    </pre>
  );
}
