import { Component, decorators, System } from '@eva/eva.js';
import { ClockComponent, now } from './clock';

export class GameLogComponent extends Component {
  static componentName = 'gamelog';
  message!: [level: keyof Console, time: number, text: string][];

  init() {
    this.message = [];
  }

  add(logs: string[], level: keyof Console = 'debug') {
    this.message = [
      ...this.message,
      [level, now(), [`@${this.gameObject.name}`, ...logs].join(' ')],
    ];
  }

  info(...logs: string[]) {
    this.add(logs, 'info');
  }

  debug(...logs: string[]) {
    this.add(logs, 'debug');
  }

  error(...logs: string[]) {
    this.add(logs, 'error');
  }
}

function format(time: number) {
  const m = Math.floor(time / 1000 / 60);
  const s = Math.floor(time / 1000) % 60;
  const mm = time % 1000;

  return `${m.toString().padStart(2, '0')}.${s.toString().padStart(2, '0')}.${mm.toString().padStart(3, '0')}`;
}

export interface LogSystemParams {}

@decorators.componentObserver({
  gamelog: ['message'],
})
class GameLogSystem extends System {
  static systemName = 'gamelog';

  constructor(params?: LogSystemParams) {
    super(params);
  }

  update() {
    const componentChanged = this.componentObserver.clear();
    const clockComponent = this.game.scene.getComponent(ClockComponent);

    for (const changed of componentChanged) {
      const { message } = changed.component as GameLogComponent;

      for (const [level, time, text] of message) {
        console[level](`[${format(time - clockComponent.startTime)}] ${text}`);
      }

      message.length = 0;
    }
  }

  onDestroy() {}
}

export { GameLogSystem };
