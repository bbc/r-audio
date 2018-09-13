import React from 'react';
import RConnectableNode from './../base/connectable-node.js';

export default class RChannelSplitter extends RConnectableNode {
  constructor(props) {
    super(props);

    this.params = { channelCount: 1 };
  }

  // override of RAudioNode.getConnectionArguments
  // because we need to have some default many-to-many behaviour
  getConnectionArguments(destination, destinationIndex, toParam) {
    const connectTarget = toParam ? destination[toParam] : destination;
    // we use modulo for channel distribution
    // in case we're connecting to more nodes than we have channels
    const fromChannel = destinationIndex % this.props.channelCount;
    // normally we expect to connect to the first channel of each destination
    // but this can be overriden
    const toChannel = !isNaN(this.props.connectToChannel) ? this.props.connectToChannel : 0;

    return [ connectTarget ].concat(toParam ? [] : [ fromChannel, toChannel ]);
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node) {
      this.node = this.context.audio.createChannelSplitter(this.props.channelCount);
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
