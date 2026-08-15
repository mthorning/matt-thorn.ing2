import React from 'react';

const style = {
  display: 'block',
  overflowX: 'auto',
  background: 'light-dark(var(--light-base-300), var(--dark-base-300))',
  color: 'light-dark(var(--light-base-content), var(--dark-base-content))',
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
