import React from 'react';
import { render } from 'react-dom';
import examples from './examples.js';

const example = location.hash.slice(1);

const onExampleChange = e => {
  location.hash = e.target.value;
  location.reload();
};

render(
  (
    <main>
      <header>
        <label htmlFor="example-select">Select an example: </label>
        <select id="example-select" onChange={onExampleChange} value={example}>
          <option value="" disabled>Choose an example</option>
          {
            Object.keys(examples).map((ex, ei) => <option key={ei} value={ex}>{ex}</option>)
          }
        </select>
      </header>
      <hr/>
      { examples[example] || null }
    </main>
  ),
  document.getElementById('app')
);
