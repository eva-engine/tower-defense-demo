import { EVAGame } from '../../eva-game-types';
import { Component, decorators, GameObject, System } from '@eva/eva.js';
import { Event } from '@eva/plugin-renderer-event';
import { ClockComponent } from './clock';
import { EnemyComponent } from './enemy';
import { GameLogComponent } from './log';

export type WeaponParams = Exclude<EVAGame.IWeapon, 'cost' | 'info'>;

export class WeaponComponent extends Component {
  static componentName = 'weapon';
  weaponName!: string;
  level!: number;
  element!: EVAGame.element;
  damage!: EVAGame.IElementalDamage;
  cd!: number;
  delay!: number;
  attackCount!: number;
  attacking!: ReturnType<typeof setInterval>;

  // eslint-disable-next-line
  constructor(params: WeaponParams) {
    super(params);
  }

  init({
    name,
    level = 1,
    element,
    damage,
    cd,
    delay,
  }: WeaponParams) {
    this.weaponName = name;
    this.level = level;
    this.element = element;
    this.damage = damage;
    this.cd = cd;
    this.delay = delay;
    this.attackCount = 0;
  }

  multiDamge(a: EVAGame.IElementalDamage, b: EVAGame.IElementalDamage, level = 1): EVAGame.IElementalDamage {
    return {
      normal: Math.round(a.normal * b.normal * level),
      fire: Math.round(a.fire * b.fire * level),
      water: Math.round(a.water * b.water * level),
      wood: Math.round(a.wood * b.wood * level),
    };
  }

  sumDamange(a: EVAGame.IElementalDamage): number {
    return a.normal + a.fire + a.water + a.wood;
  }

  attack() {
    const clockComponent = this.gameObject.scene.getComponent(ClockComponent);

    clockComponent.delay(this.delay)
      .then(() => {
        this.attacking = clockComponent.repeat(() => {
          this.attackCount += 1;
          this.emit('attack');
        }, this.cd);
      });
  }

  onDestroy() {
    clearInterval(this.attackCount);
  }
}

@decorators.componentObserver({
  weapon: ['attackCount'],
})
class WeaponSystem extends System {
  static systemName = 'weapon';
  baseDamage!: EVAGame.IElementalDamage;

  // eslint-disable-next-line
  constructor(params: EVAGame.IElementalDamage) {
    super(params);
  }

  init(params: EVAGame.IElementalDamage) {
    this.baseDamage = params;
  }

  update() {
    const componentChanged = this.componentObserver.clear();
    let enemys: GameObject[] = [];

    if (componentChanged.length > 0) {
      enemys = this.game.scene.gameObjects.filter((gameObject) => !!gameObject.getComponent(EnemyComponent));
    }

    for (const changed of componentChanged) {
      const { component, gameObject } = changed;

      if (!gameObject) continue;

      const logComponent = gameObject.getComponent(GameLogComponent);
      const eventComponent = gameObject.getComponent(Event);

      if (component instanceof WeaponComponent && component.attackCount > 0) {
        const damage = component.multiDamge(this.baseDamage, component.damage, component.level);
        eventComponent.emit('playIdle', 1);

        for (const enemy of enemys) {
          const enemyComponet = enemy.getComponent(EnemyComponent);
          const realDamage = component.sumDamange(component.multiDamge(damage, enemyComponet.resistance));
          enemyComponet.healthPoint -= realDamage;
          logComponent.debug(`attack @${enemy.name} with ${realDamage} HP`);
        }
      }
    }
  }

  onDestroy() {}
}

export { WeaponSystem };
