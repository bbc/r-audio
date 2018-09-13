/* global AudioWorkletNode */
import React from 'react';
import RConnectableNode from './../base/connectable-node.js';

export default class RAudioWorklet extends RConnectableNode {
  constructor(props) {
    super(props);

    this.params = Object.assign({}, this.props);
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node) {
      this.node = new AudioWorkletNode(this.context.audio, this.props.worklet);
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
