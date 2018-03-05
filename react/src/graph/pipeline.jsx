import React from 'react';
import RAudioNode from './../base/audio-node.jsx';
import RComponent from './../base/component.jsx';

import * as AudioNodes from './../audio-nodes/index.jsx';
import RSplit from './split.jsx';

const connectableTypes = [
  AudioNodes.RGain,
  AudioNodes.RBiquadFilter,
  AudioNodes.RStereoPanner,
  RSplit
];

/**
 * A RComponent which connects its children in a series, creating inbound branches if necessary.
 *
 * @class      RPipeline (name)
 */
class RPipeline extends RComponent {
  constructor(props) {
    super(props);
    this.resolveDestination = this.resolveDestination.bind(this);
    this.resolvePointer = this.resolvePointer.bind(this);
    this.resolveParent = this.resolveParent.bind(this);
  }

  /**
   * Ensures whatever value we get from the `nodes` Map, we resolve it to where the actual AudioNodes are.
   *
   * @param      {AudioNode|Array}  pointer  The value found in the `nodes` Map
   * @return     {AudioNode|Array<AudioNode>}  the actual destination(s)
   */
  resolvePointer(pointer) {
    // we might find that the pointer actually leads us to a list of other pointers (Symbols)
    // this happens, for instance, if the next child is a RSplit
    if (pointer instanceof Array) {
      return pointer.map(identifier => this.context.nodes.get(identifier));
    } else {
      return pointer;
    }
  }

  /**
   * Tries to provide a destination getter function for the given index in the children array.
   * It optimizes for finding the nearest node in the graph which the given child can connect to.
   *
   * @param      {number}  currentIndex   The current child's index
   * @param      {Array}  childrenArray  The array of all children in the pipeline
   * @return     {Function}  a function which returns the closest possible destination node
   */
  resolveDestination(currentIndex, childrenArray) {
    let destinationFunction = null;

    if (currentIndex === childrenArray.length - 1) {
      destinationFunction = () => this.props.destination();
    } else if (!RPipeline.isConnectableType(childrenArray[currentIndex + 1].component.type)) {
      let childIndex = currentIndex + 1;

      while(childrenArray[childIndex++]) {
        if (RPipeline.isConnectableType(childrenArray[childIndex].component.type)) break;
      }

      if (childIndex === currentIndex + 1) {
        destinationFunction = () => this.props.destination();
      } else {
        destinationFunction = () => this.resolvePointer(this.context.nodes.get(childrenArray[childIndex].identifier));
      }
    } else {
      destinationFunction = () => this.resolvePointer(this.context.nodes.get(childrenArray[currentIndex + 1].identifier));
    }

    return destinationFunction;
  }

  resolveParent(currentIndex, childrenArray) {
    if (currentIndex === 0) {
      return this.getParent || null;
    } else {
      const children = childrenArray.slice(0, currentIndex);
      const parents = [];

      let child = children.pop();

      if (RComponent.isPrototypeOf(child.component.type)) {
        // the first preceding RComponent is always a valid parent
        parents.push(child.identifier);
        // if it's a connectable type it's also the only parent
        if (RPipeline.isConnectableType(child.component.type)) return () => parents;
        // if not, continue
        child = children.pop();
      }

      // look for all preceding RComponents until we hit one which is connectable
      while (child) {
        if (RPipeline.isConnectableType(child.component.type)
          || !RComponent.isPrototypeOf(child.component.type)) break;

        parents.push(child.identifier);
        child = children.pop();
      }

      return () => parents;
    }
  }

  render() {
    const children = React.Children
      .toArray(this.props.children)
      .map(c => ({ component: c,  identifier: Symbol(c.type.name + Date.now()) }))
      .map((childTuple, childIndex, childrenArray) => {
        if (!RComponent.isPrototypeOf(childTuple.component.type)) return childTuple.component;

        const getDestination = this.resolveDestination(childIndex, childrenArray);
        const getParent = this.resolveParent(childIndex, childrenArray);

        const pipelineProps = {
          destination: getDestination,
          parent: getParent,
          identifier: childIndex === 0 ? this.props.identifier : childTuple.identifier
        };

        return React.cloneElement(childTuple.component, pipelineProps);
      });

    if (this.context.debug) {
      return (
        <li>
          <strong>RPipeline</strong>
          <ul>
          {children}
          </ul>
        </li>
      )
    }

    return children;
  }

  static isConnectableType(type) {
    return connectableTypes.includes(type);
  }
}

export { RPipeline, connectableTypes };
