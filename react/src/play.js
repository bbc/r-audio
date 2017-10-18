import React from 'react';
import RAComponent from './base/component';

const createSource = (ctx, attrs) => {
  const source = ctx.createBufferSource();
  for (let a in attrs) {
    source[a] = attrs[a];
  }
  source.connect(ctx.destination);
  return source;
};

export default class RAPlay extends RAComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.context.audio) {
      console.warn(`looks like you haven't wrapped the following reaudio component in an RAAudioContext.`, this);
      return;
    }

    fetch(this.props.src)
    .then(res => res.arrayBuffer())
    .then(ab => this.context.audio.decodeAudioData(ab))
    .then(buf => createSource(this.context.audio, {
      buffer: buf,
      loop: !!this.props.loop
    }).start(0));
  }

  render() {
    if (this.context.debug) {
      return (
        <li>
          <strong>Play</strong><br/>
          <ul>
            <li>Source: <code>{this.props.src}</code></li>
            <li>Loop: <code>{this.props.loop.toString()}</code></li>
          </ul>
        </li>
      );
    }

    return null;
  }
};
