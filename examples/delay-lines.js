/**

**/
import React from 'react';
import { render } from 'react-dom';

import {
  RAudioContext,
  RBiquadFilter,
  RCycle,
  RDelay,
  RGain,
  ROscillator,
  RPipeline,
  RSplit,
  RStereoPanner
} from '../index.js';

export default class DelayLineExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { periodicWave: null, start: 0, stop: 3 };
    // a simple waveform can be created with a series of periodically repeating numbers
    const realComponents = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
    // imaginary components can all be 0 for demo purposes
    const imagComponents = realComponents.map(() => 0);

    this.onContextInit = ctx => {
      this.setState({
        periodicWave: ctx.createPeriodicWave(
          Float32Array.from(realComponents),
          Float32Array.from(imagComponents),
          { disableNormalization: true }
        )
      });

      // schedule restart of the oscillator after 6 seconds
      setInterval(() => this.setState({ start: ctx.currentTime, stop: ctx.currentTime + 3 }), 6000);
    };
  }

  render() {
    return (
      <RAudioContext debug={true} onInit={this.onContextInit}>
        <article>
          <h1>Delay lines &amp; scheduling</h1>
          <p>
            This example demonstrates how one can create feedback delay lines using the <code>RCycle</code> component.
            It also shows how scheduling works.
          </p>
          <p>Make sure to always include a <code>RGain</code> with <code>gain</code> &lt; 1 to avoid infinite feedback.</p>
        </article>
        <RPipeline>
          <ROscillator
            frequency={220} type="triangle" detune={0}
            periodicWave={this.state.periodicWave}
            start={this.state.start}
            stop={this.state.stop}/>
          <ROscillator frequency={1} type="square" detune={0} connectToParam="gain" start={0}/>
          <RGain gain={1} />
          <RSplit>
            <RGain gain={0.5} />
            <RCycle>
              <RPipeline>
                <RDelay delayTime={0.1} />
                <RGain gain={0.4} />
                <RStereoPanner pan={-1}/>
              </RPipeline>
            </RCycle>
            <RCycle>
              <RPipeline>
                <RDelay delayTime={0.3} />
                <RGain gain={0.4} />
                <RStereoPanner pan={1}/>
              </RPipeline>
            </RCycle>
          </RSplit>
        </RPipeline>
      </RAudioContext>
    );
  }
}
