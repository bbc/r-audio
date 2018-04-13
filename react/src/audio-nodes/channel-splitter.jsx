import React from 'react';
import RAudioNode from './../base/audio-node.jsx';

export default class RChannelSplitter extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = {
      channelCount: props.channelCount
    };
  }

  // override of RAudioNode.getConnectionArguments
  getConnectionArguments(destination, destinationIndex, toParam) {
    const connectTarget = toParam ? destination[toParam] : destination;
    const fromChannel = destinationIndex;
    const toChannel = 0;

    return [ connectTarget ].concat(toParam ? [] : [ fromChannel, toChannel ]);
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node || !(this.node instanceof ChannelSplitterNode)) {
      this.node = this.context.audio.createChannelSplitter(this.props.channelCount);
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
