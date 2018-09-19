import React from 'react';
import RPipeline from './pipeline.js';

/**
 * A subclass of RPipeline which can be extended to create custom r-audio nodes
 * To create a custom node, subclass RExtensible and override the `renderGraph` method,
 * returning the r-audio graph of your custom node
 *
 * @class      RExtensible (name)
**/
export default class RExtensible extends RPipeline {
  renderGraph() {
    return null;
  }

  addKeys(child, childIndex) {
    return React.cloneElement(child, { key: childIndex });
  }

  render() {
    this.customChildren = [ this.renderGraph() ].map(this.addKeys);
    return super.render();
  }
}
