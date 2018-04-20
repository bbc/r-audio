import React from 'react';
import { render } from 'react-dom';

import RAudioContext from '../src/base/audio-context.jsx';
import RPipeline from '../src/graph/pipeline.jsx';
import RSplit from '../src/graph/split.jsx';

import {
  ROscillator,
  RGain,
  RBiquadFilter,
  RStereoPanner
} from '../src/audio-nodes/index.jsx';

const pipeline = (detune, gain, filterFreq, pan) => (
  <RAudioContext debug={true}>
    <article>
      <h1>Complex effects graph</h1>
      <p>This example demonstrates how <em>r-audio</em> handles various graph configurations,
      including non-connectable nodes in pipelines and deeply nested parallel/serial connections.</p>

      <p>It also shows how to create 'dead-end' branches using the <code>disconnected</code> attribute.</p>
    </article>
    <RPipeline>
      <ROscillator start={0} frequency={440} type="triangle" detune={0}/>
      <ROscillator start={0} frequency={220} type="triangle" detune={detune} transitionDuration={.5}/>
      <RGain gain={gain} transitionDuration={1} name='gainToSplit'/>
      <RSplit>
        <ROscillator start={0} frequency={330} type="triangle" detune={detune + 3} transitionDuration={.5} />
        <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={0} transitionDuration={.8}/>
        <RPipeline>
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={5} transitionDuration={.8}/>
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={5} transitionDuration={.8}/>
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={5} transitionDuration={.8}/>
          <ROscillator start={0} frequency={1} type="sine" detune={0} connectToParam='pan' />
          <RStereoPanner />
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={3} transitionDuration={.8} />
        </RPipeline>
        <RPipeline>
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={3} transitionDuration={.8} disconnected />
        </RPipeline>
      </RSplit>
      <RPipeline>
        <ROscillator start={0} frequency={110} type="sawtooth" detune={0}/>
        <ROscillator start={0} frequency={1} type="sine" detune={0} connectToParam='pan' />
        <RStereoPanner />
      </RPipeline>
      <RGain gain={.8} transitionDuration={1}/>
      <RBiquadFilter frequency={filterFreq} gain={1.5} Q={10.1} type="lowpass" detune={0} transitionDuration={.8}/>
    </RPipeline>
  </RAudioContext>
);

export default class ComplexGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detune: 50,
      gain: 0.4,
      filterFreq: 600,
      pan: 0
    };

    setInterval(() => {
      this.setState({
        detune: Math.random() * 100,
        gain: Math.random() / 2 + .5,
        filterFreq: Math.random() * 3000 + 200,
        pan: Math.random() * 2 - 1
      });
    }, 2000);
  }

  render() {
    return pipeline(this.state.detune, this.state.gain, this.state.filterFreq, this.state.pan);
  }
};
