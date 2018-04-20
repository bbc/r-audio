/**
This example demonstrates how r-audio graphs can be mutated via React state.
r-audio takes care of reconfiguring the connections and instantiating new nodes as necessary.

Notice that we can embed a HTML `<button>` element in the graph, too.
**/
import React from 'react';
import { render } from 'react-dom';

import RAudioContext from '../src/base/audio-context.jsx';
import RPipeline from '../src/graph/pipeline.jsx';
import RSplit from '../src/graph/split.jsx';

import {
  ROscillator,
  RGain,
  RBiquadFilter,
  RStereoPanner,
} from '../src/audio-nodes/index.jsx';

export default class Mutation extends React.Component {
  constructor() {
    super();
    this.nodeCache = [
      <ROscillator start={0} key={1} frequency={440} type="triangle" detune={0} />,
      <RBiquadFilter key={2} frequency={1000} gain={1} Q={1} type="lowpass" detune={0} transitionDuration={.8} />,
      <RStereoPanner key={4} />
    ];

    this.state = {
      nodes: this.nodeCache,
      toggle: true,
      freq: 440
    };

    this.change = () => {
      const changed = this.nodeCache.slice();
      changed.splice(0, 1, <ROscillator key={1} frequency={220} type="triangle" detune={0} />);
      this.setState({ freq: 220 });
    }
  }

  render() {
    return (
      <RAudioContext debug={true}>
        <RPipeline>
          <button onClick={this.change}>Mutate audio graph</button>
          <ROscillator start={0} key={1} frequency={440} type="triangle" detune={0} />
          <RSplit>
            <ROscillator start={0} key={3} frequency={this.state.freq} type="triangle" detune={0} />
            <RBiquadFilter key={2} frequency={1000} gain={1} Q={1} type="lowpass" detune={0} transitionDuration={.8} />
            <RStereoPanner key={4} />
          </RSplit>
          <RPipeline>
            <RGain gain={.5} transitionDuration={1} />
            <RGain gain={.5} transitionDuration={1} />
          </RPipeline>
        </RPipeline>
      </RAudioContext>
    )
  }
};
