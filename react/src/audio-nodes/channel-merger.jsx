import React from 'react';
import RAudioNode from './../base/audio-node.jsx';

export default class RChannelMerger extends RAudioNode {
  constructor(props) {
    super(props);

    this.params = {
      channelCount: props.channelCount
    };
  }

  componentWillMount() {
    super.componentWillMount();

    if (!this.node || !(this.node instanceof ChannelMergerNode)) {
      this.node = this.context.audio.createChannelMerger(this.props.channelCount);
      this.context.nodes.set(this.props.identifier, this.node);
    }

    this.updateParams = this.updateParams.bind(this);
    this.updateParams(this.props);
  }
}
