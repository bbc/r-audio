import React from 'react';
import RComponent from './component.js';

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
    this.connectToAllDestinations = this.connectToAllDestinations.bind(this);
    this.setParam = this.setParam.bind(this);
  }

  // recursively builds up a list of nodes pointed to by IDs or lists of IDs
  flattenPointers(destinations, flattened = []) {
    for (let element of destinations) {
      if (Array.isArray(element)) {
        this.flattenPointers(element, flattened);
      } else if (typeof element === 'symbol') {
        flattened.push(this.context.nodes.get(element));
      } else {
        flattened.push(element);
      }
    }

    return flattened;
  }

  /**
   * Generates arguments for AudioNode.connect
   * Useful because we can, for instance, override the channel assignment logic for ChannelSplitter etc.
   *
   * @param      {function} destination The AudioNode to connect to
   * @param      {number} destinationIndex The index of the AudioNode among other destinations
   * @param      {string|null} toParam The name of the AudioParam to connect to (or undefined)
   * @param      {number} fromChannel The index of the chosen output channel of this node (default is 0)
   * @param      {number} toChannel The index of the chosen input channel of the destination node (default is 0)
   */
  getConnectionArguments(destination, destinationIndex, toParam, fromChannel = 0, toChannel = 0) {
    const connectTarget = toParam ? destination[toParam] : destination;

    return [ connectTarget ].concat(toParam ? [] : [ fromChannel, toChannel ]);
  }

  /**
   * Connects the given AudioNode to this RAudioNode's destinations.
   * Abstracts away this operation as it's used in multiple lifecycle stages.
   *
   * @param      {function} destinationFunction The function that will return the destinations
   * @param      {AudioNode}  webAudioNode  The web audio node
   */
  connectToAllDestinations(destinationFunction, webAudioNode) {
    webAudioNode.disconnect();

    if (destinationFunction && !this.props.disconnected) {
      let destinations = destinationFunction();

      if (!(destinations instanceof Array)) destinations = [ destinations ];

      this.flattenPointers(destinations).forEach((destination, di) => {
        if (destination) {
          const connectArgs = this.getConnectionArguments(
            destination,
            di,
            this.props.connectToParam,
            this.props.connectFromChannel,
            this.props.connectToChannel);

          webAudioNode.connect(...connectArgs);
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

  // we use DidUpdate to connect to new destinations,
  // because WillUpdate might get called before the new destinations are ready
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.destination !== this.props.destination) {
      this.connectToAllDestinations(this.props.destination, this.node);
    }
  }

  componentWillUnmount() {
    this.node.disconnect();
    this.context.nodes.delete(this.props.identifier);
  }

  resolveTransitionProps(props, propName) {
    const transitionTime = typeof props.transitionTime === 'number'
      ? props.transitionTime
      : props.transitionTime ? props.transitionTime[propName] : null;

    const transitionCurve = typeof props.transitionCurve === 'string'
      ? props.transitionCurve
      : props.transitionCurve ? props.transitionCurve[propName] : null;

    return [ transitionTime, transitionCurve ];
  }

  // updates only Web Audio-related parameters
  // (both AudioParams and regular properties)
  updateParams(props) {
    if (!this.params) return;

    for (let p in this.params) {
      if (!(p in props)) continue;

      const [ transitionTime, transitionCurve ] = this.resolveTransitionProps(props, p);

      if (this.node[p] instanceof AudioParam) {
        this.setParam(this.node[p], props[p], transitionTime, transitionCurve);
      } else if (this.node.parameters && this.node.parameters.has(p)) {
        let param = this.node.parameters.get(p);
        this.setParam(param, props[p], transitionTime, transitionCurve);
      } else if (p in this.node) {
        // some browsers (e.g. Chrome) will try to set channelCount and throw an error
        // since we can't use Object.getOwnPropertyDescriptor on the AudioNodes
        // we simply wrap the action in a try-catch
        try {
          if (this.node[p] !== props[p]) this.node[p] = props[p];
        } catch(e) {
          console.warn(`Tried setting ${p} on node`, this.node); // eslint-disable-line no-console
        }
      }
    }
  }

  setParam(param, value, transitionTime, transitionCurve) {
    if (transitionCurve) {
      const fn = `${transitionCurve}RampToValueAtTime`;
      // `exponentialRamp` doesn't seem to work on Firefox, so fall back to linear
      try {
        param[fn](value, transitionTime);
      } catch (e) {
        param['linearRampToValueAtTime'](value, transitionTime);
      }
    } else {
      param.setValueAtTime(value, transitionTime || this.context.audio.currentTime);
    }
  }

  componentDidMount() {
    this.connectToAllDestinations(this.props.destination, this.node);
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
                if (typeof this.props[p] === 'boolean') param = this.props[p].toString();

                if (!(['number', 'string', 'boolean'].includes(typeof this.props[p]))) {
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
