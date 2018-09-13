import React from 'react';
import RAudioNode from './audio-node.js';

/**
 * Any RAudioNode that can be scheduled to start/end is a RScheduledSource
 *
 * @class      RScheduledSource (name)
 */
export default class RScheduledSource extends RAudioNode {
  constructor(props) {
    super(props);
    this.readyToPlay = false;
    this.playbackScheduled = false;

    this.onEnded = this.onEnded.bind(this);
    this.schedule = this.schedule.bind(this);
  }

  onEnded() {
    this.playbackScheduled = false;
    // Web Audio will remove the node from the graph after stopping, so reinstantiate it
    this.instantiateNode();
    this.connectToAllDestinations(this.props.destination, this.node);
  }

  schedule() {
    const shouldScheduleStart =
      typeof this.props.start === 'number' &&
      this.readyToPlay &&
      !this.playbackScheduled &&
      (typeof this.props.stop !== 'number' || this.props.start < this.props.stop);

    const shouldScheduleStop =
      typeof this.props.stop === 'number';

    if (shouldScheduleStart) {
      this.node.start(this.props.start || 0, this.props.offset || 0, this.props.duration);
      this.playbackScheduled = true;
    }

    if (shouldScheduleStop) {
      this.node.stop(this.props.stop);
    }
  }
  /**
  Overriding this method enables sources to specify special conditions when playback should be rescheduled.
  e.g. BufferSource should be rescheduled if a new buffer is provided
  **/
  shouldStartWithPropsChange() {
    return false;
  }

  componentDidMount() {
    super.componentDidMount();
    this.schedule();
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);

    if (prevProps.start !== this.props.start ||
        prevProps.stop !== this.props.stop ||
        this.shouldStartWithPropsChange(prevProps, this.props)) {
      this.schedule();
    }
  }
}
