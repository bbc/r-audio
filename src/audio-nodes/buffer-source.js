import React from 'react';
import RScheduledSource from './../base/scheduled-source.js';

export default class RBufferSource extends RScheduledSource {
  constructor(props) {
    super(props);

    this.params = {
      buffer: props.buffer || null,
      detune: props.detune || 0,
      loop: props.loop || false,
      loopStart: props.loopStart || 0,
      loopEnd: props.loopEnd || 0,
      playbackRate: props.playbackRate || 1
    };

    this.onEnded = this.onEnded.bind(this);
    this.instantiateNode = this.instantiateNode.bind(this);
  }

  instantiateNode() {
    if (!this.node) {
      this.node = this.context.audio.createBufferSource();
      this.node.addEventListener('ended', this.onEnded);

      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }

  // we need to make a new AudioBufferSourceNode after playback ends
  onEnded(e) {
    super.onEnded(e);
    this.instantiateNode();
    this.connectToAllDestinations(this.props.destination, this.node);
    if (this.props.onEnded) this.props.onEnded(e);
  }

  componentWillMount() {
    super.componentWillMount();
    this.instantiateNode();
  }

  componentDidMount() {
    this.readyToPlay = !!this.props.buffer;
    super.componentDidMount();
  }

  shouldStartWithPropsChange(prevProps, currentProps) {
    return prevProps.buffer !== currentProps.buffer;
  }

  componentDidUpdate(prevProps, prevState) {
    this.readyToPlay = !!this.props.buffer;
    super.componentDidUpdate(prevProps, prevState);
  }
}
