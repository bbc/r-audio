import RConnectableNode from './../base/connectable-node.js';

import RCycle from './cycle.js';
import RPipeline from './pipeline.js';
import RSplit from './split.js';
import RSplitChannels from './split-channels.js';

const isConnectable = component => {
  return RConnectableNode.isPrototypeOf(component.type) ||
      [ RSplit, RCycle, RSplitChannels, RPipeline ].includes(component.type);
};

// this rather strange function is used when we want to get a numeric value
// from either a child or its parent's props
// but the child takes precedence (for overriding)
const propertyFromChildOrParent = (child, parent) => property => {
  return !isNaN(child.props[property])
    ? child.props[property]
    : parent.props[property];
};

export {
  isConnectable,
  propertyFromChildOrParent
};
