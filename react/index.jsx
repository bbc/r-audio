import RPlay from './src/play.jsx';
import RAudioContext from './src/audio-context.jsx';
import React from 'react';
import { render } from 'react-dom';

import { RPipeline } from './src/graph/pipeline.jsx';
import RSplit from './src/graph/split.jsx';
import RCycle from './src/graph/cycle.jsx';

import RSplitChannels from './src/graph/split-channels.jsx';

import ROscillator from './src/audio-nodes/oscillator.jsx';
import RGain from './src/audio-nodes/gain.jsx';
import RBiquadFilter from './src/audio-nodes/biquad-filter.jsx';
import RStereoPanner from './src/audio-nodes/stereo-panner.jsx';
import RDelay from './src/audio-nodes/delay.jsx';
import RBufferSource from './src/audio-nodes/buffer-source.jsx';
import RConvolver from './src/audio-nodes/convolver.jsx';
import RWaveShaper from './src/audio-nodes/wave-shaper.jsx';
import RDynamicsCompressor from './src/audio-nodes/dynamics-compressor.jsx';

export { RAudioContext, RPlay, RPipeline, RSplit, ROscillator, RGain, RBiquadFilter, RStereoPanner, RWaveShaper, RDynamicsCompressor };

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
          <ROscillator key={1} frequency={440} type="triangle" detune={0} />
          <RSplit>
            { this.state.nodes }
          </RSplit>
          <RPipeline>
            <RGain gain={.5} transitionDuration={1} />
            <RGain gain={.5} transitionDuration={1} />
          </RPipeline>
        </RPipeline>
      </RAudioContext>
    )
  }
}

const delays = (
  <RAudioContext debug={true}>
    <RPipeline>
      <ROscillator frequency={220} type="triangle" detune={0} />
      <ROscillator frequency={1} type="square" detune={0} connectToParam="gain" />
      <RGain gain={1} />
      <RSplit>
        <RGain gain={.5} />
        <RCycle>
          <RPipeline>
            <RDelay delayTime={.1} />
            <RGain gain={.4} />
            <RStereoPanner pan={-1}/>
          </RPipeline>
        </RCycle>
        <RCycle>
          <RPipeline>
            <RDelay delayTime={.3} />
            <RGain gain={.4} />
            <RStereoPanner pan={1}/>
          </RPipeline>
        </RCycle>
      </RSplit>
    </RPipeline>
  </RAudioContext>
)

class BufferSourceExample extends React.Component {
  constructor() {
    super();

    this.state = { buffer: null };
  }

  componentDidMount() {
    fetch('/assets/audio/b.wav')
    .then(res => res.arrayBuffer())
    .then(ab => this.audioContext.decodeAudioData(ab))
    .then(buffer => this.setState({ buffer }));
  }

  makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  };

  render() {
    return (
      <RAudioContext debug={true} onInit={ctx => this.audioContext = ctx}>
        <RPipeline>
          <RBufferSource buffer={this.state.buffer} loop/>
          <RSplitChannels channelCount={2}>
            <RPipeline>
              <RWaveShaper curve={this.makeDistortionCurve(200)} />
              <RConvolver buffer={this.state.buffer} />
              <RDynamicsCompressor threshold={-50} knee={40}/>
              <RGain gain={.5} />
            </RPipeline>
            <RPipeline>
              <ROscillator frequency={1} type="sine" detune={0} connectToParam="gain" />
              <RGain gain={1} />
            </RPipeline>
          </RSplitChannels>
        </RPipeline>
      </RAudioContext>
    )
  }
}


render(<BufferSourceExample />,
document.getElementById('app')
);
