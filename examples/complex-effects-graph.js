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

const pipeline = (detune, gain, filterFreq, pan) => (
  <RAudioContext debug={true}>
    <article>
      <h1>Complex effects graph</h1>
      <p>This example demonstrates how <em>r-audio</em> handles various graph configurations,
      including non-connectable nodes in pipelines and deeply nested parallel/serial connections.</p>

      <p>It also shows how to create &lsquo;dead-end&rsquo; branches using the <code>disconnected</code> attribute.</p>
    </article>
    <RPipeline>
      <ROscillator start={0} frequency={440} type="triangle" detune={0}/>
      <ROscillator start={0} frequency={220} type="triangle" detune={detune} transitionTime={0.5}/>
      <RGain gain={gain} transitionTime={1} name='gainToSplit'/>
      <RSplit>
        <ROscillator start={0} frequency={330} type="triangle" detune={detune + 3} transitionTime={0.5} />
        <RBiquadFilter frequency={1000} gain={gain} Q={1} type="lowpass" detune={detune}
          transitionTime={{ gain: 5, detune: 10 }}
          transitionCurve={{ gain: 'exponential', detune: 'linear' }} />
        <RPipeline>
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={5} transitionTime={0.8}/>
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={5} transitionTime={0.8}/>
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={5} transitionTime={0.8}/>
          <ROscillator start={0} frequency={1} type="sine" detune={0} connectToParam='pan' />
          <RStereoPanner />
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={3} transitionTime={0.8} />
        </RPipeline>
        <RPipeline>
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={3} transitionTime={0.8} disconnected />
        </RPipeline>
      </RSplit>
      <RPipeline>
        <ROscillator start={0} frequency={110} type="sawtooth" detune={0}/>
        <ROscillator start={0} frequency={1} type="sine" detune={0} connectToParam='pan' />
        <RStereoPanner />
      </RPipeline>
      <RGain gain={0.8} transitionTime={1}/>
      <RBiquadFilter frequency={filterFreq} gain={1.5} Q={10.1} type="lowpass" detune={0} transitionTime={0.8}/>
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
        gain: Math.random() / 2 + 0.5,
        filterFreq: Math.random() * 3000 + 200,
        pan: Math.random() * 2 - 1
      });
    }, 2000);
  }

  render() {
    return pipeline(this.state.detune, this.state.gain, this.state.filterFreq, this.state.pan);
  }
}
