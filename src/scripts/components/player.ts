import { EVAGame } from '../../eva-game-types';
import { Component, decorators, System } from '@eva/eva.js';
import { Text } from '@eva/plugin-renderer-text';

export type PlayerParams = EVAGame.IPlayer;

export class PlayerComponent extends Component {
  static componentName = 'player';
  healthPoint!: number;
  gold!: number;

  constructor(params: PlayerParams) {
    super(params);
  }

  init({ HP, Gold }: PlayerParams) {
    this.healthPoint = HP;
    this.gold = Gold;
  }
}

@decorators.componentObserver({
  player: ['healthPoint'],
})
class PlayerSystem extends System {
  static systemName = 'system';

  update() {
    const conponentChanged = this.componentObserver.clear();

    for (const changed of conponentChanged) {
      const { gameObject, component } = changed;

      if (gameObject && component instanceof PlayerComponent) {
        const heartHpTransform = gameObject.transform.children.find(childTransform => childTransform.gameObject.name === 'player-hp');
        const textComponent = heartHpTransform?.gameObject.getComponent(Text);

        if (textComponent) {
          textComponent.text = Math.max(component.healthPoint, 0) + '';
        }

        if (component.healthPoint <= 0) {
          this.game.emit('result', { win: false });
        }
      }
    }
  }
}

export { PlayerSystem };
