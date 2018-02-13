import RAPlay from './src/play';
import RAAudioContext from './src/audio-context';
import React from 'react';
import { render } from 'react-dom';

import RAPipeline from './src/pipeline';
import RAOscillator from './src/audio-nodes/oscillator';
import RAGain from './src/audio-nodes/gain';

const plays = (
  <RAAudioContext debug={true}>
      <RAPlay src="/assets/audio/a.wav" loop={true} />
      <RAPlay src="/assets/audio/b.wav" loop={false} />
  </RAAudioContext>
);

const pipeline = (detune, gain) => (
  <RAAudioContext debug={true}>
    <RAOscillator frequency={110} type="sine" detune={0}/>
    <RAPipeline>
      <RAOscillator frequency={220} type="triangle" detune={detune} transitionDelay={.5}/>
      <RAGain gain={gain} transitionDelay={1}/>
    </RAPipeline>
  </RAAudioContext>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { detune: 50, gain: 0.4 };
    setInterval(() => {
      this.setState({ detune: Math.random() * 100, gain: Math.random() })
    }, 2000);
  }

  render() {
    return pipeline(this.state.detune, this.state.gain);
  }
}


render(<App/>,
document.getElementById('app')
);
