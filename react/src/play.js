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
  componentDidMount() {
    fetch(this.props.src)
    .then(res => res.arrayBuffer())
    .then(ab => this.context.audio.decodeAudioData(ab))
    .then(buf => createSource(this.context.audio, {
      buffer: buf,
      loop: !!this.props.loop
    }).start(0));
  }
};
