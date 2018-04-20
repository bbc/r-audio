import RConnectableNode from './../base/connectable-node.jsx';

import RCycle from './cycle.jsx';
import RPipeline from './pipeline.jsx';
import RSplit from './split.jsx';
import RSplitChannels from './split-channels.jsx';

const isConnectable = component => {
  return RConnectableNode.isPrototypeOf(component.type)
      || [ RSplit, RCycle, RSplitChannels, RPipeline ].includes(component.type);
};

export {
  isConnectable
}
