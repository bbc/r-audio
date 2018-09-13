import React from 'react';
import RConnectableNode from './../base/connectable-node.js';

export default class RDelay extends RConnectableNode {
  constructor(props) {
    super(props);

    this.params = {
      delayTime: props.delayTime
    };
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node) {
      this.node = this.context.audio.createDelay();
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
