import React from 'react';

import RComponent from './../base/component.js';
import RSplit from './split.js';
import RPipeline from './pipeline.js';
import RChannelSplitter from '../audio-nodes/channel-splitter.js';
import RChannelMerger from '../audio-nodes/channel-merger.js';

// This is a helper RComponent which splits the input between its children
// connected in parallel, one channel per branch.
// It's better to use this instead of RChannelSplitter and RChannelMerger
// as it takes care of the channel connections automatically
export default class RSplitChannels extends RComponent {
  render() {
    const children = React.Children
      .toArray(this.props.children)
      .slice(0, this.props.channelCount)
      .map((element, ci) => {
        const channelProps = {
          connectFromChannel: 0,
          connectToChannel: element.props.connectToChannel || ci
        };
        return React.cloneElement(element, channelProps);
      });

    return (
      <RPipeline identifier={this.props.identifier} destination={this.props.destination}>
        <RChannelSplitter channelCount={this.props.channelCount} />
        <RSplit>
          {children}
        </RSplit>
        <RChannelMerger channelCount={this.props.channelCount} />
      </RPipeline>
    );
  }
}
