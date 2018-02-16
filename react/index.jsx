import RPlay from './src/play.jsx';
import RAudioContext from './src/audio-context.jsx';
import React from 'react';
import { render } from 'react-dom';

import RPipeline from './src/pipeline.jsx';
import ROscillator from './src/audio-nodes/oscillator.jsx';
import RGain from './src/audio-nodes/gain.jsx';
import RBiquadFilter from './src/audio-nodes/biquad-filter.jsx';
import RStereoPanner from './src/audio-nodes/stereo-panner.jsx';

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
      <RGain gain={gain} transitionDuration={1}/>
      <RPipeline>
        <ROscillator frequency={110} type="sine" detune={0}/>
        <RStereoPanner pan={pan} />
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


render(<App/>,
document.getElementById('app')
);
