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

### examples

```jsx
<Timeline type="mono">
  <Play src="hello.wav" />
  <Play src="world.wav" />
</Timeline>
```
This should just play hello and world consecutively.

```jsx
<Timeline type="poly">
  <Play src="hello.wav" />
  <Play src="world.wav" start="1.5"/>
</Timeline>
```
This should play them concurrently, hello starting after 1.5 seconds.

```jsx
<Pipeline input="" output="">
  <Oscillator frequency="440" />
  <BiquadFilter type="highpass" cutoff="2000" />
  <Split>
    <Delay delayTime="400" />
    <Pipeline>
      <Delay delayTime="500" />
      <Gain gain="0.8" />
    </Pipeline>
  </Split>
</Pipeline>
```
This should create an oscillator, plug it into a filter, split the graph into two branches, apply a delay on one of them, and a sub-pipeline on the other. Both branches should be plugged into the same output of the Split.

Because no output is specified, we just plug the pipeline into `context.destination`.
