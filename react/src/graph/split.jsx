import React from 'react';
import RAudioNode from './../base/audio-node.jsx';
import RComponent from './../base/component.jsx';
import { RPipeline } from './pipeline.jsx';

/**
 * A RComponent which connects its children in parallel, creating inbound branches if necessary.
 *
 * @class      RSplit (name)
 */
export default class RSplit extends RComponent {
  constructor(props) {
    super(props);
    this.inputs = [];
  }

  componentWillMount() {
    super.componentWillMount();
    this.context.nodes.set(this.props.identifier, this.inputs);
  }

  render() {
    const children = React.Children
      .toArray(this.props.children)
      .map(c => ({ component: c,  identifier: Symbol() }))
      .map((childTuple, childIndex, childrenArray) => {
        const type = childTuple.component.type;
        // RPipeline is technically not a connectable type, but it does provide a destination
        if (RPipeline.isConnectableType(type) || type === RPipeline) {
          this.inputs.push(childTuple.identifier);
        }

        const pipelineProps = {
          destination: this.props.destination,
          identifier: childTuple.identifier
        };

        return React.cloneElement(childTuple.component, pipelineProps);
      });

    if (this.context.debug) {
      return (
        <li>
          <strong>RSplit</strong>
          <ul>
          {children}
          </ul>
        </li>
      )
    }

    return children;
  }
}
