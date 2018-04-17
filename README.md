# r-audio
`~ declarative audio components ~ sound as a function of state ~`

## Features
- makes Web Audio graph code more readable and representative of the graph shape
- makes it easy to create reusable graphs as React components
- makes state management easier with React's one-way data bindings and single source of state
- able to represent any arbitrary directed graph
- supports all non-deprecated audio nodes including `AudioWorklet` (except `IIRFilterNode` as of 17 April 2018)
- allows interspersed HTML components in the graph

Any directed graph can be created by composing the following components:

+ `RPipeline` connects child nodes in a series
+ `RSplit` connects child nodes in parallel
+ `RCycle` connects child nodes to themselves
+ `RSplitChannels` is like RSplit, but connects a different channel to each child and merges them at the end

## Setup

```bash
cd react
npm install
npm run dev
```

The demo page will be served at `localhost:8081`.

### Examples

Full working code examples are in the `/examples` directory.

### A stereo delay on an oscillator with feedback
```jsx
(
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
```

### Stereo waveshaper + amplitude modulation on a WAV loop
```jsx
(
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
```

### AudioWorklet bitcrusher + Analyser
```jsx
(
  <RAudioContext debug={true} onInit={ctx => this.loadWorkletAndStream.bind(this)(ctx)}>
  {
    // the `ready` flag is set when the worklet is instantiated
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
)
```

