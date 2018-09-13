import React from 'react';
import RAudioNode from './audio-node.js';

/**
 * Any RAudioNode that can be connected to is a RConnectableNode
 *
 * @class      RConnectableNode (name)
 */
export default class RConnectableNode extends RAudioNode {
  componentWillUnmount() {
    super.componentWillUnmount();

    if (this.props.parent) {
      const parents = this.props.parent();

      this.flattenPointers(parents).forEach((parentIdentifier, parentIndex) => {
        const parent = this.context.nodes.get(parentIdentifier);
        if (!parent) return;

        try {
          parent.disconnect(this.node);
        } catch (e) {
          console.warn(e); // eslint-disable-line no-console
        }
      });
    }
  }
}
