import React from 'react';
import RAudioNode from './base/audio-node.jsx';
import RComponent from './base/component.jsx';
import RGain from './audio-nodes/gain.jsx';
import RBiquadFilter from './audio-nodes/biquad-filter.jsx';
import RStereoPanner from './audio-nodes/stereo-panner.jsx';

const connectableTypes = [
  RGain,
  RBiquadFilter,
  RStereoPanner
];

/**
 * A RComponent which connects its children in a series, creating inbound branches if necessary.
 *
 * @class      RPipeline (name)
 */
export default class RPipeline extends RComponent {
  constructor(props) {
    super(props);
    this.resolveDestination = this.resolveDestination.bind(this);
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
    if (currentIndex === childrenArray.length - 1) {
      return () => this.props.destination();
    } else if (!RPipeline.isConnectableType(childrenArray[currentIndex + 1].component.type)) {
      let childIndex = currentIndex + 1;

      while(childrenArray[childIndex++]) {
        if (RPipeline.isConnectableType(childrenArray[childIndex].component.type)) break;
      }

      if (childIndex === currentIndex + 1) {
        return () => this.props.destination();
      } else {
        return () => this.context.nodes.get(childrenArray[childIndex].identifier);
      }
    } else {
      return () => this.context.nodes.get(childrenArray[currentIndex + 1].identifier);
    }
  }

  render() {
    const children = React.Children
      .toArray(this.props.children)
      .map(c => ({ component: c,  identifier: Symbol() }))
      .map((childTuple, childIndex, childrenArray) => {
        const getDestination = this.resolveDestination(childIndex, childrenArray);

        const pipelineProps = {
          destination: getDestination,
          identifier: childIndex === 0 ? this.props.identifier : childTuple.identifier
        };

        return React.cloneElement(childTuple.component, pipelineProps);
      });

    if (this.context.debug) {
      return (
        <li>
          <strong>Pipeline</strong>
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
