import React from 'react';
import { render } from 'react-dom';

import RAudioContext from '../src/base/audio-context.jsx';
import RPipeline from '../src/graph/pipeline.jsx';
import RSplitChannels from '../src/graph/split-channels.jsx';

import {
  RGain,
  RDelay,
  RAnalyser,
  RMediaStreamSource,
  RAudioWorklet
} from '../src/audio-nodes/index.jsx';

export default class AudioWorkletExample extends React.Component {
  constructor() {
    super();
    this.state = { stream: null, ready: false };
  }

  loadWorkletAndStream(ctx) {
    const streamPromise = navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(stream => this.setState({ stream }))
      .catch(err => console.log('The following gUM error occured: ' + err));

    const workletPromise = ctx.audioWorklet
      .addModule('/assets/js/bit-crusher.js')

    Promise.all([ streamPromise, workletPromise ])
      .then(() => this.setState({ ready: true }));
  }

  render() {
    return (
      <RAudioContext debug={true} onInit={ctx => this.loadWorkletAndStream.bind(this)(ctx)}>
        <article>
          <h1>Buffers and Channels</h1>
          <p>This example demonstrates how to use an <code>AudioWorklet</code> in <em>r-audio</em>. It also shows a RAnalyser in action.</p>
          <p>Notice that the graph only renders after both the media stream and the worklet have been initialised.</p>
        </article>
        {
          this.state.ready ? (
            <RPipeline>
              <RMediaStreamSource stream={this.state.stream} />
              <RAnalyser fftSize={2048}>
              {
                proxy => {
                  const data = new Float32Array(proxy.frequencyBinCount);
                  // when this function first runs, there will be no data yet
                  // so wait a bit
                  // in reality one might want to save the `proxy` object and call it independently
                  // for instance, inside a `requestAnimationFrame` call
                  setTimeout(() => {
                    proxy.getFloatFrequencyData(data);
                    console.log(data);
                  }, 3000);
                }
              }
              </RAnalyser>
              <RDelay delayTime={.3} bitDepth={4} />
              <RSplitChannels channelCount={2}>
                <RAudioWorklet worklet="bit-crusher" bitDepth={4} frequencyReduction={.5}/>
                <RAudioWorklet worklet="bit-crusher" bitDepth={4} frequencyReduction={.5}/>
              </RSplitChannels>
              <RGain gain={0.4} />
            </RPipeline>
          ) : null
        }
      </RAudioContext>
    );
  }
};
