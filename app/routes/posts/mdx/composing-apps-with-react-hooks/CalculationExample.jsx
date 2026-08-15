'use client';

import React, { useState, useEffect } from 'react';

const percentCalc = (input, operand) => (input * operand) / 100;
const radiusCalc = (input) => Math.PI * input * input;

function useCalculation(operand, calc) {
  const [inputNumber, setInputNumber] = useState(null);

  const [result, setResult] = useState(null);
  useEffect(() => {
    setResult(calc(inputNumber, operand));
  }, [inputNumber, calc, operand]);

  return [result, inputNumber, setInputNumber];
}

function GetCalculation(props) {
  const {
    operand = 20,
    calc = percentCalc,
    resultMessage = (inputNumber, result, operand) =>
      `${operand}% of ${inputNumber} is ${result}`,
  } = props;

  const [result, inputNumber, setInputNumber] = useCalculation(operand, calc);

  function handleInputChange(event) {
    setInputNumber(event.target.value);
  }

  return (
    <>
      <input type="number" onChange={handleInputChange} />
      {inputNumber && (
        <span
          style={{
            whiteSpace: 'nowrap',
            marginLeft: '10px',
          }}
        >
          {resultMessage(inputNumber, result, operand)}
        </span>
      )}
    </>
  );
}

const examples = {
  one: () => (
    <>
      <p
        style={{
          margin: '20px 0 10px 0',
        }}
      >
        Add a number to get 20%:
      </p>
      <GetCalculation />
    </>
  ),
  two: () => (
    <>
      <p
        style={{
          margin: '20px 0 10px 0',
        }}
      >
        Add a number to get 20%:
      </p>
      <GetCalculation />
      <p
        style={{
          margin: '20px 0 10px 0',
        }}
      >
        Add a number to get 30%:
      </p>
      <GetCalculation operand={30} />
    </>
  ),
  three: () => (
    <>
      <p
        style={{
          margin: '20px 0 10px 0',
        }}
      >
        Add a number to get 20%:
      </p>
      <GetCalculation />
      <p
        style={{
          margin: '20px 0 10px 0',
        }}
      >
        Add the circle&apos;s radius to get the area:
      </p>
      <GetCalculation
        calc={radiusCalc}
        resultMessage={(input, result, operand) =>
          `The circle's area is ${result.toFixed(2)}`
        }
      />
    </>
  ),
};

export default function ExampleComponent({ example }) {
  const Component = examples[example];
  return (
    <div
      style={{
        width: '100%',
        height: '300px',
        padding: '20px',
        border:
          '1px solid lightDark(var(--light-neutral), var(--dark-neutral))',
        margin: '20px 0 20px 0',
        borderRadius: '5px',
      }}
    >
      <div
        style={{
          padding: '10px',
        }}
      >
        <Component />
      </div>
    </div>
  );
}
