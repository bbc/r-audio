import React from 'react';

import AudioWorkletExample from './audio-worklet.js';
import DelayLineExample from './delay-lines.js';
import ComplexGraph from './complex-effects-graph.js';
import BuffersAndChannels from './buffers-channels.js';
import MediaElementSourceExample from './media-element.js';
import MediaStreamSourceExample from './media-stream.js';
import Mutation from './mutation.js';
import GainMatrixExample from './gain-matrix.js';
import CustomNodeExample from './custom-nodes.js';

const examples = {
  'audio-worklet': <AudioWorkletExample/>,
  'delay-lines-scheduling': <DelayLineExample />,
  'complex-effects-graph': <ComplexGraph/>,
  'buffers-channels': <BuffersAndChannels/>,
  'media-element': <MediaElementSourceExample/>,
  'media-stream': <MediaStreamSourceExample/>,
  'mutation': <Mutation/>,
  'gain-matrix': <GainMatrixExample/>,
  'custom-node': <CustomNodeExample />,
};

export default examples;
