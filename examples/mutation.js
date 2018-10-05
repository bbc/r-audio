import React from 'react';
import { render } from 'react-dom';

import {
  RAudioContext,
  RBiquadFilter,
  RGain,
  ROscillator,
  RPipeline,
  RSplit,
  RStereoPanner
} from '../index.js';

export default class Mutation extends React.Component {
  constructor() {
    super();
    this.nodeCache = [
      <ROscillator start={1} key={1} frequency={440} type="triangle" detune={0} />,
      <RBiquadFilter key={2} frequency={600} type="lowpass" detune={0} transitionDuration={0.8} />,
      <RStereoPanner key={3} />
    ];

    this.state = {
      nodes: this.nodeCache,
      toggle: true,
      freq: 440
    };

    this.change = () => {
      const changed = this.nodeCache.slice();
      changed.splice(1, 1, <RGain key={2} gain={0.5} />);
      this.setState({ nodes: changed });
    };
  }

  render() {
    return (
      <RAudioContext debug={true}>
        <article>
          <h1>Mutation</h1>
          This example demonstrates how <em>r-audio</em> graphs can be mutated via React state.
          <em>r-audio</em> takes care of reconfiguring the connections and instantiating new nodes as necessary.
        </article>
        <RPipeline>
          <button onClick={this.change}>Mutate audio graph</button>
          <ROscillator start={0} frequency={440} type="triangle" detune={0} />
          {this.state.nodes}
          <RGain gain={0.5} transitionDuration={1} />
        </RPipeline>
      </RAudioContext>
    );
  }
}
