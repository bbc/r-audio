import React from 'react';
import RAAudioNode from './base/audio-node';
import RAComponent from './base/component';

export default class RAPipeline extends RAComponent {
  connect(toNode) {
    const lastChild = this.props.children[this.props.children.length - 1];
    if (lastChild instanceof RAAudioNode) lastChild.connect(toNode);
  }

  render() {
    const children = React.Children
      .toArray(this.props.children)
      .map((child, i, _children) => {
        if (i === _children.length - 1) {
          return React.cloneElement(child, { destination: this.props.destination });
        }

        return React.cloneElement(child, { destination: _children[i + 1] });
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

    return this.props.children;
  }
}
