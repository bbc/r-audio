import React from 'react';

import AudioWorkletExample from './audio-worklet.jsx';
import DelayLineExample from './delay-lines.jsx';
import ComplexGraph from './complex-effects-graph.jsx';
import BuffersAndChannels from './buffers-channels.jsx';
import MediaElementSourceExample from './media-element.jsx';
import MediaStreamSourceExample from './media-stream.jsx';
import Mutation from './mutation.jsx';
import GainMatrix from './gain-matrix.jsx';

const examples = {
  'audio-worklet': <AudioWorkletExample/>,
  'delay-lines-scheduling': <DelayLineExample />,
  'complex-effects-graph': <ComplexGraph/>,
  'buffers-channels': <BuffersAndChannels/>,
  'media-element': <MediaElementSourceExample/>,
  'media-stream': <MediaStreamSourceExample/>,
  'mutation': <Mutation/>,
  'gain-matrix': <GainMatrix/>,
}

export default examples;
