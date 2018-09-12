# r-audio
A library of React components for building [Web Audio](https://www.w3.org/TR/webaudio/) graphs.

## Objectives
👉 make Web Audio graph code more readable and representative of the graph shape

👉 make it easier to create reusable graphs

👉 make state management easier with React's one-way data bindings and single source of state

👉 represent any arbitrary directed graphs in JSX

👉 support all non-deprecated audio nodes including `AudioWorklet`

👉 allow interspersed HTML components in audio components

## Installation

```bash
npm install r-audio
```

## Usage example

Stereo waveshaper + amplitude modulation on a WAV loop
```jsx
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
```

## Useful links
- [Full usage examples](https://github.com/bbc/r-audio/tree/master/examples)
- [API Reference](https://github.com/bbc/r-audio/wiki/API-Reference)

## Development setup

```bash
npm install
npm run dev
```

The demo page will be served at `localhost:8080`. Use a recent version of Chrome or Firefox for the best experience.

Firefox Web Audio developer tool is especially handy (bear in mind Firefox does not support AudioWorklet as of 17 April 2018).

