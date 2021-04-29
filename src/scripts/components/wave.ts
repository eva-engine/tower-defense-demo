import { EVAGame } from '../../eva-game-types';
import { Component, decorators, System } from '@eva/eva.js';
import { PlayerComponent } from './player';

export class WaveComponent extends Component {
  static componentName = 'wave';

  count = 0;

  start() {
    this.count = 0;
  }
}

@decorators.componentObserver({
  wave: ['count'],
})
class WaveSystem extends System {
  static systemName = 'wave';
  waves!: EVAGame.IWave[];

  constructor(params: EVAGame.IWave[]) {
    super(params);
  }

  init(waves: EVAGame.IWave[]) {
    this.waves = waves;
  }

  update() {
    const componentChanged = this.componentObserver.clear();
    let playComponent: PlayerComponent | undefined;

    if (componentChanged.length > 0) {
      playComponent = this.game.scene.gameObjects
        .find((gameObject) => gameObject.name === 'player')
        ?.getComponent(PlayerComponent);
    }

    for (const changed of componentChanged) {
      const { component } = changed;

      if (component instanceof WaveComponent) {
        if (component.count >= this.waves.length) {
          this.game.emit('result', {
            win: playComponent && playComponent.healthPoint > 0,
          });
        }
      }
    }
  }

  onDestroy() {}
}

export { WaveSystem };
