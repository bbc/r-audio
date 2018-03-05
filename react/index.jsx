import RPlay from './src/play.jsx';
import RAudioContext from './src/audio-context.jsx';
import React from 'react';
import { render } from 'react-dom';

import { RPipeline } from './src/graph/pipeline.jsx';
import RSplit from './src/graph/split.jsx';

import ROscillator from './src/audio-nodes/oscillator.jsx';
import RGain from './src/audio-nodes/gain.jsx';
import RBiquadFilter from './src/audio-nodes/biquad-filter.jsx';
import RStereoPanner from './src/audio-nodes/stereo-panner.jsx';

export { RAudioContext, RPlay, RPipeline, RSplit, ROscillator, RGain, RBiquadFilter, RStereoPanner };

const plays = (
  <RAudioContext debug={true}>
      <RPlay src="/assets/audio/a.wav" loop={true} />
      <RPlay src="/assets/audio/b.wav" loop={false} />
  </RAudioContext>
);

const pipeline = (detune, gain, filterFreq, pan) => (
  <RAudioContext debug={true}>
    <RPipeline>
      <ROscillator frequency={440} type="triangle" detune={0}/>
      <ROscillator frequency={220} type="triangle" detune={detune} transitionDuration={.5}/>
      <RGain gain={gain} transitionDuration={1} name='gainToSplit'/>
      <RSplit>
        <ROscillator frequency={330} type="triangle" detune={detune + 3} transitionDuration={.5} />
        <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={0} transitionDuration={.8}/>
        <RPipeline>
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={5} transitionDuration={.8}/>
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={5} transitionDuration={.8}/>
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={5} transitionDuration={.8}/>
          <ROscillator frequency={1} type="sine" detune={0} connectToParam='pan' />
          <RStereoPanner />
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={3} transitionDuration={.8} />
        </RPipeline>
        <RPipeline>
          <RBiquadFilter frequency={1000} gain={1} Q={1} type="lowpass" detune={3} transitionDuration={.8} disconnected />
        </RPipeline>
      </RSplit>
      <RPipeline>
        <ROscillator frequency={110} type="sawtooth" detune={0}/>
        <ROscillator frequency={1} type="sine" detune={0} connectToParam='pan' />
        <RStereoPanner />
      </RPipeline>
      <RGain gain={.8} transitionDuration={1}/>
      <RBiquadFilter frequency={filterFreq} gain={1.5} Q={10.1} type="lowpass" detune={0} transitionDuration={.8}/>
    </RPipeline>
  </RAudioContext>
);

class App extends React.Component {
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
}

class MutationExample extends React.Component {
  constructor() {
    super();
    this.nodeCache = [
      <ROscillator key={1} frequency={440} type="triangle" detune={0} />,
      <RBiquadFilter key={2} frequency={1000} gain={1} Q={1} type="lowpass" detune={0} transitionDuration={.8} />,
      <RStereoPanner key={4} />
    ];

    this.state = {
      nodes: this.nodeCache,
      toggle: true
    };

    this.change = () => {
      const changed = this.nodeCache.slice();
      changed.splice(1, 1, <RGain key={3} gain={.8} transitionDuration={1} />);
      this.setState({ nodes: changed });
    }
  }

  render() {
    return (
      <RAudioContext debug={true}>
        <RPipeline>
          <button onClick={this.change}>Mutate audio graph</button>
          { this.state.nodes }
          <RPipeline>
            <RGain gain={.5} transitionDuration={1} />
            <RGain gain={.5} transitionDuration={1} />
          </RPipeline>
        </RPipeline>
      </RAudioContext>
    )
  }
}


render(<MutationExample />,
document.getElementById('app')
);
