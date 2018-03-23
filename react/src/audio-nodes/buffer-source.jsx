import React from 'react';
import RAudioNode from './../base/audio-node.jsx';

export default class RBufferSource extends RAudioNode {
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
  }

  onEnded() {
    this.node = null;
    this.componentWillMount();
    this.connectToDestinations(this.props.destination, this.node);
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node || !(this.node instanceof BufferSourceNode)) {
      this.node = this.context.audio.createBufferSource();
      this.node.addEventListener('ended', this.onEnded);

      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.props.buffer) this.node.start(this.props.start || 0);
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
    if (this.props.buffer) this.node.start(this.props.start || 0);
  }
}
