import RConnectableNode from './../base/connectable-node.jsx';

import RCycle from './cycle.jsx';
import RPipeline from './pipeline.jsx';
import RSplit from './split.jsx';
import RSplitChannels from './split-channels.jsx';

const isConnectable = component => {
  return RConnectableNode.isPrototypeOf(component.type)
      || [ RSplit, RCycle, RSplitChannels, RPipeline ].includes(component.type);
};

// this rather strange function is used when we want to get a property value
// from either the child or the parent
// but the child takes precedence (for overriding)
const propertyFromChildOrParent = (child, parent) => property => {
  return !isNaN(child.props[property])
    ? child.props[property]
    : parent.props[property];
}

export {
  isConnectable,
  propertyFromChildOrParent,
}
