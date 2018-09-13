import React from 'react';
import RConnectableNode from './../base/connectable-node.js';

export default class RConvolver extends RConnectableNode {
  constructor(props) {
    super(props);

    this.params = {
      buffer: props.buffer || null,
      normalize: props.normalize || true
    };
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node) {
      this.node = this.context.audio.createConvolver();
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
