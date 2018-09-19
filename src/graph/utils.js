import RConnectableNode from './../base/connectable-node.js';

const connectableComponents = [
  'RSplit',
  'RCycle',
  'RSplitChannels',
  'RPipeline'
];

const isConnectable = component => {
  return RConnectableNode.isPrototypeOf(component.type) ||
      connectableComponents.includes(component.type.name) ||
      Object.getPrototypeOf(component.type).name === 'RExtensible';
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
