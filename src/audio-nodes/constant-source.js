import React from 'react';
import RScheduledSource from './../base/scheduled-source.js';

export default class RConstantSource extends RScheduledSource {
  constructor(props) {
    super(props);

    this.params = {
      offset: props.offset
    };

    this.instantiateNode = this.instantiateNode.bind(this);
    this.readyToPlay = true;
    this.onEnded = this.onEnded.bind(this);
  }

  onEnded(e) {
    super.onEnded(e);
    if (this.props.onEnded) this.props.onEnded(e);
  }

  instantiateNode() {
    if (!this.node || this.playbackScheduled === false) {
      this.node = this.context.audio.createConstantSource();
      this.node.addEventListener('ended', this.onEnded);

      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }

  componentWillMount() {
    super.componentWillMount();
    this.instantiateNode();
  }
}
