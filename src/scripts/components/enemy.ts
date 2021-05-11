import { EVAGame } from '../../eva-game-types';
import { DragonBone } from '@eva/plugin-renderer-dragonbone';
import { Component, decorators, System } from '@eva/eva.js';
import { ClockComponent } from './clock';
import { GameLogComponent } from './log';
import { MapComponent, MapSystem } from './map';
import { PlayerComponent } from './player';
import { WaveComponent } from './wave';
import { Graphics } from '@eva/plugin-renderer-graphics';

export interface IEnemyResource {
  color: number;
}

export const EnemyResource: {
  normal: IEnemyResource;
  fire: IEnemyResource;
  water: IEnemyResource;
  wood: IEnemyResource;
} = {
  normal: {
    color: 0x999999,
  },
  fire: {
    color: 0xff0000,
  },
  water: {
    color: 0x0000ff,
  },
  wood: {
    color: 0x00ff00,
  },
};

export enum EnemyStatus {
  idle = 0,
  walking,
  ending,
  dead,
  queen,
}

export type EnemyParams = EVAGame.IEnemy;

export class EnemyComponent extends Component {
  static componentName = 'enemy';
  enemyName!: string;
  element!: EVAGame.element;
  healthPoint!: number;
  HP!: number;
  damage!: number;
  resistance!: EVAGame.IElementalDamage;
  speed!: number;
  status: EnemyStatus = EnemyStatus.idle;
  moving!: ReturnType<typeof setInterval>;
  distance: number = 0;

  // eslint-disable-next-line
  constructor(params: EnemyParams) {
    super(params);
  }

  init({ name, element, HP, damage, resistance, speed }: EnemyParams) {
    this.enemyName = name;
    this.element = element;
    this.healthPoint = HP;
    this.HP = HP;
    this.damage = damage;
    this.resistance = resistance;
    this.speed = speed;
  }

  onDestroy() {
    clearInterval(this.moving);
  }

  enter() {
    this.status = EnemyStatus.walking;
    const animi = this.gameObject.getComponent(DragonBone);
    animi.play('newAnimation');

    this.distance = 0;
  }

  move() {
    const clockComponent = this.gameObject.scene.getComponent(ClockComponent);
    this.moving = clockComponent.repeat(() => {
      if (this.status === EnemyStatus.walking) {
        this.distance += 1;
      }
    }, 1000 / this.speed);
  }

  die() {
    clearInterval(this.moving);
    this.status = EnemyStatus.dead;
  }

  victory() {
    clearInterval(this.moving);
    this.status = EnemyStatus.queen;
  }
}

export interface EnemySystemParams {}

@decorators.componentObserver({
  enemy: ['distance', 'healthPoint'],
})
class EnemySystem extends System {
  static systemName = 'enemy';

  // eslint-disable-next-line
  constructor(params?: EnemySystemParams) {
    super(params);
  }

  update() {
    const componentChanged = this.componentObserver.clear();
    let mapSystem: MapSystem | undefined;
    let waveComponent: WaveComponent | undefined;
    let playerComponent: PlayerComponent | undefined;

    if (componentChanged.length > 0) {
      mapSystem = this.game.getSystem(MapSystem) as MapSystem;
      waveComponent = this.game.scene.getComponent(WaveComponent);
      playerComponent = this.game.scene.gameObjects
        .find((gameObject) => gameObject.name === 'player')
        ?.getComponent(PlayerComponent);
    }


    for (const changed of componentChanged) {
      const { gameObject, component } = changed;
      const props = changed.prop?.prop || [];

      if (!gameObject) continue;

      const mapComponent = gameObject.getComponent(MapComponent);
      const gameLogComponent = gameObject.getComponent(GameLogComponent);

      if (component instanceof EnemyComponent) {
        for (const propName of props) {
          switch (propName) {
            case 'distance': {
              if (mapSystem && component.distance >= mapSystem.routeDistance) {
                if (component.healthPoint > 0) {
                  if (playerComponent) {
                    playerComponent.healthPoint -= component.damage;
                    gameLogComponent?.debug(`attack Player with ${component.damage}HP`);
                  }

                  if (waveComponent) {
                    waveComponent.count += 1;
                  }

                  component.victory();
                  gameObject.destroy();
                }
              } else {
                mapComponent.y = mapComponent.transform.position.y + component.distance;
              }
              break;
            }
            case 'healthPoint': {
              gameLogComponent?.debug(`left ${component.healthPoint}HP`);

              if (component.healthPoint <= 0) {
                if (waveComponent) {
                  waveComponent.count += 1;
                }

                component.die();
                gameObject.destroy();
              } else {
                const healthBarTransform = gameObject?.transform?.children.find(child => child.gameObject.name === 'health-bar');
                const healthBarGraphic = healthBarTransform?.gameObject?.getComponent(Graphics);

                if (healthBarGraphic) {
                  const healthPointWidth = Math.floor(Math.max(10, (component.healthPoint / component.HP) * 150));
                  healthBarGraphic.graphics.clear();
                  healthBarGraphic.graphics.beginFill(0xde3249, 1);
                  healthBarGraphic.graphics.drawRoundedRect(0, 0, healthPointWidth, 24, 9);
                  healthBarGraphic.graphics.endFill();
                }
              }
              break;
            }
          }
        }
      }
    }
  }
}

export { EnemySystem };
