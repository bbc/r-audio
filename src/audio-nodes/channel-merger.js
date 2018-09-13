import React from 'react';
import RConnectableNode from './../base/connectable-node.js';

export default class RChannelMerger extends RConnectableNode {
  constructor(props) {
    super(props);

    this.params = { channelCount: 1 };
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node) {
      this.node = this.context.audio.createChannelMerger(this.props.channelCount);
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
