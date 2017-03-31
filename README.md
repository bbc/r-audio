# reaudio

`~ declarative audio components ~ sound as a function of state ~ wip ~`

## goals

make Web Audio graphs:
  - more readable
  - diffable
  - a function of state

### `reaudio` should have:
- interoperability with React etc.
- compatibility with A-Frame
- an API so that it could work with Web Components
- in future, ability to have positional data so this could be used in 3D games


### components
- `<AudioContext />` should contain all other components, which automatically get a reference to it via React's `context` (is there another way to do this?).
- `<Play src="" start="" loop="" toggle="" />` plays audio
- `<Timeline type="mono|poly" />` plays `<Play />`s in a sequence
- `<Pipeline />` plugs in a sequence of components sequentially in an audio graph (not time-wise)
- `<Split />` connects the previous component to each of its children, and makes the children connect to any following components
- `<AudioNode />` is a wrapper around a Web Audio node
- ?? `<ParamTimeline />` is like Timeline but 'plays' an `AudioParam` of the (?) parent


```jsx
<Timeline>
  <Play src="hello.wav" />
  <Play src="world.wav" />
</Timeline>
```

```jsx
<Pipeline input="" output="">
  <Oscillator frequency="440" />
  <BiquadFilter type="highpass" cutoff="2000" />
  <Split>
    <Pipeline>
      <Delay delayTime="400" />
    </Pipeline>
    <Pipeline>
      <Delay delayTime="500" />
      <Gain gain="0.8" />
    </Pipeline>
  </Split>
</Pipeline>
```
