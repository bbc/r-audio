# r-audio
`~ declarative audio components ~ sound as a function of state ~`

## Features
- makes Web Audio graph code more readable and representative of the graph shape
- makes it easy to create reusable graphs as React components
- makes state management easier with React's one-way data bindings and single source of state
- able to represent any arbitrary directed graph
- supports all non-deprecated audio nodes including `AudioWorklet` (except `IIRFilterNode` as of 17 April 2018)
- allows interspersed HTML components in the graph

## Setup

```bash
cd react
npm install
npm run dev
```

The demo page will be served at `localhost:8081`.

### Example

Working code examples are in the `/examples` directory.

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

