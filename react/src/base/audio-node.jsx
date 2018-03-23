import React from 'react';
import RComponent from './component.jsx';

/**
 * Any RComponent that corresponds to an AudioNode is a RAudioNode
 *
 * @class      RAudioNode (name)
 */
export default class RAudioNode extends RComponent {
  constructor(props) {
    super(props);
    // internal AudioNode instance
    this.node = null;
    // dictionary of AudioNode parameters (either AudioParams or object properties)
    this.params = {};
    this.connectToDestinations = this.connectToDestinations.bind(this);
  }

  flattenDestinations(destinations, flattened = []) {
    for (let element of destinations) {
      if (Array.isArray(element)) {
        this.flattenDestinations(element, flattened);
      } else if (typeof element === 'symbol') {
        flattened.push(this.context.nodes.get(element));
      } else {
        flattened.push(element);
      }
    }

    return flattened;
  }

  /**
   * Connects the given AudioNode to this RAudioNode's destinations.
   * Abstracts away this operation as it's used in multiple lifecycle stages.
   *
   * @param      {function} destinationFunction The function that will return the destinations
   * @param      {AudioNode}  webAudioNode  The web audio node
   */
  connectToDestinations(destinationFunction, webAudioNode) {
    webAudioNode.disconnect();

    if (destinationFunction && !this.props.disconnected) {
      let destinations = destinationFunction();

      if (!(destinations instanceof Array)) destinations = [ destinations ];

      this.flattenDestinations(destinations).forEach(destination => {
        if (destination) {
          webAudioNode.connect(this.props.connectToParam ? destination[this.props.connectToParam] : destination);
        }
      });
    }
  }

  componentWillMount() {
    super.componentWillMount();
  }

  componentWillReceiveProps(nextProps) {
    this.updateParams(nextProps);
  }

  componentWillUpdate(nextProps, nextState) {
    // update the node's record in the node registry
    if (this.props.identifier !== nextProps.identifier) {
      this.context.nodes.delete(this.props.identifier);
      this.context.nodes.set(nextProps.identifier, this.node);
    }
  }

  // we use DidUpdate to connect to new destinations, because WillUpdate might get called before the new destinations are ready
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.destination !== this.props.destination) {
      this.connectToDestinations(this.props.destination, this.node);
    }
  }

  componentWillUnmount() {
    this.node.disconnect();
    this.context.nodes.delete(this.props.identifier);

    if (this.props.parent) {
      const parents = this.props.parent();

      parents.forEach(parentIdentifier => {
        const parent = this.context.nodes.get(parentIdentifier);
        if (!parent) return;

        try {
          parent.disconnect(this.node);
        } catch(e) {
          console.warn(e);
        }
      })
    }
  }

  updateParams(props) {
    if (!this.params) return;

    for (let p in this.params) {
      if (!(p in props)) continue;

      if (this.node[p] instanceof AudioParam) {
        if (props.transitionDuration) {
          this.node[p].linearRampToValueAtTime(props[p], this.context.audio.currentTime + props.transitionDuration);
        } else {
          this.node[p].setValueAtTime(props[p], this.context.audio.currentTime);
        }
      }
      else {
        if (this.node[p] !== props[p]) this.node[p] = props[p];
      }
    }
  }

  componentDidMount() {
    this.connectToDestinations(this.props.destination, this.node);
  }

  render() {
    if (this.context.debug) {
      return (
        <li>
          <div>
            <strong>
              {this.constructor.name} <em>{this.props.name || ''}</em>
              <sup><mark>{this.props.disconnected && 'disconnected' || ''}</mark></sup>
            </strong>
            <div>{ this.props.connectToParam ? <span> connects to <em>{this.props.connectToParam}</em></span> : null }</div>
          </div>
          <ul>
            {
              Object.keys(this.params).map((p, pi) => {
                if (!this.props[p] && this.props[p] !== 0) return null;

                let param = this.props[p];

                if (!(typeof this.props[p] in ['number', 'string', 'boolean'])) {
                  param = param.constructor.name;
                }

                return <li key={pi}>{p}: <code>{param}</code></li>;
              })
            }
          </ul>
        </li>
      );
    }

    return null;
  }
}
