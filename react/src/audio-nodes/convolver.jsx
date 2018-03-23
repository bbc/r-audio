import React from 'react';
import RAudioNode from './../base/audio-node.jsx';

export default class RConvolver extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = {
      buffer: props.buffer || null,
      normalize: props.normalize || true
    };
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node || !(this.node instanceof ConvolverNode)) {
      this.node = this.context.audio.createConvolver();
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
