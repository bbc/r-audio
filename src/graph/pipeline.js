import React from 'react';
import RComponent from './../base/component.js';

import { isConnectable } from './utils.js';

/**
 * A RComponent which connects its children in a series, creating inbound branches if necessary.
 *
 * @class      RPipeline (name)
 */
export default class RPipeline extends RComponent {
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
    let resolved = pointer;

    if (pointer instanceof Array) {
      // it could also happen that the pointer leads to an AudioNode reference (esp. if it's an AudioContextDestination)
      resolved = pointer.map(identifier => this.context.nodes.get(identifier) || identifier);
    }

    return resolved;
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
    } else if (!isConnectable(childrenArray[currentIndex + 1].component)) {
      let childIndex = currentIndex + 1;

      while (childrenArray[++childIndex]) {
        if (isConnectable(childrenArray[childIndex].component)) break;
      }

      if (childIndex === currentIndex + 1 || !childrenArray[childIndex]) {
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
        if (isConnectable(child.component)) return () => parents;
        // if not, continue
        child = children.pop();
      }

      // look for all preceding RComponents until we hit one which is connectable
      while (child) {
        if (isConnectable(child.component) ||
          !RComponent.isPrototypeOf(child.component.type)) break;

        parents.push(child.identifier);
        child = children.pop();
      }

      return () => parents;
    }
  }

  /**
   * Returns an Object containing the given Component and its unique identifier
   *
   * @param      {Component}  component  The React component
   * @return     {Object}  the identified child object
   */
  createIdentifiedChild(component) {
    const identifiedChild = {
      component,
      identifier: Symbol(component.type.name + Date.now())
    };

    if (!this.foundFirstConnectableType && isConnectable(component)) {
      identifiedChild.identifier = this.props.identifier;
      this.foundFirstConnectableType = true;
    }

    return identifiedChild;
  }

  /**
   * Returns a clone of the child Component with parent, destination and identifier props added to it
   *
   * @param      {Object}  identifiedChild  The identified child object
   * @param      {Number}  childIndex       The child index
   * @param      {Array}  childrenArray    The children array
   * @return     {Component}  A clone of the child Component
   */
  createEmbeddableChild(identifiedChild, childIndex, childrenArray) {
    if (!RComponent.isPrototypeOf(identifiedChild.component.type)) return identifiedChild.component;

    const getDestination = this.resolveDestination(childIndex, childrenArray);
    const getParent = this.resolveParent(childIndex, childrenArray);

    const pipelineProps = {
      destination: getDestination,
      parent: getParent,
      identifier: identifiedChild.identifier
    };

    if (childIndex === childrenArray.length - 1) {
      Object.assign(pipelineProps, {
        connectFromChannel: this.props.connectFromChannel || 0,
        connectToChannel: this.props.connectToChannel || 0
      });
    }

    return React.cloneElement(identifiedChild.component, pipelineProps);
  }

  render() {
    this.foundFirstConnectableType = false;

    const originalChildren = React.Children.toArray(this.props.children);
    const children = (this.customChildren || originalChildren)
      .filter(c => c !== null && c !== [])
      // double mapping because the second functor needs to peek ahead on the children array
      .map(this.createIdentifiedChild, this)
      .map(this.createEmbeddableChild, this);

    if (this.context.debug) {
      return (
        <li>
          <strong>{this.constructor.name}</strong>
          <ul>
            {children}
          </ul>
        </li>
      );
    }

    return children;
  }
}
