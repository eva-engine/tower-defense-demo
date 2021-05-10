import { Component } from '@eva/eva.js';

export function now() {
  return typeof performance !== 'undefined' ? performance.now() >> 0 : Date.now();
}

export class ClockComponent extends Component {
  static componentName = 'clock';
  private _startTime!: number;
  level = 1;

  get pastTime() {
    return (now() - this._startTime) * this.level;
  }

  get startTime() {
    return this._startTime;
  }

  awake() {
    this._startTime = now();
  }

  repeat(fn: Parameters<typeof setInterval>[2], time: number) {
    return setInterval(fn, time / this.level);
  }

  delay(time: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, time / this.level);
    });
  }
}
