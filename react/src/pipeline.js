import React from 'react';
import RAudioNode from './base/audio-node';
import RComponent from './base/component';

export default class RPipeline extends RComponent {
  constructor(props) {
    super(props);
  }

  connect(toNode) {
    const lastChild = this.props.children[this.props.children.length - 1];
    if (lastChild instanceof RAudioNode) lastChild.connect(toNode);
  }

  render() {
    const children = React.Children
      .toArray(this.props.children)
      .map(c => ({ component: c,  identifier: Symbol() }))
      .map((childTuple, i, childrenArray) => {
        const getDestination = i === childrenArray.length - 1
          ? () => this.props.destination()
          : () => this.context.nodes.get(childrenArray[i + 1].identifier);

        const pipelineProps = {
          destination: getDestination,
          identifier: childTuple.identifier
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
}
