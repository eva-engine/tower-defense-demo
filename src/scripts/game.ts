import { EVAGame } from '../eva-game-types';
import { Game, GameObject } from '@eva/eva.js';
import { RendererSystem } from '@eva/plugin-renderer';
import { GraphicsSystem } from '@eva/plugin-renderer-graphics';
import { DragonBoneSystem } from '@eva/plugin-renderer-dragonbone';
import { Event, EventSystem } from '@eva/plugin-renderer-event';
import { TextSystem } from '@eva/plugin-renderer-text';
import { ImgSystem } from '@eva/plugin-renderer-img';
import { RenderSystem } from '@eva/plugin-renderer-render';
import { TransitionSystem } from '@eva/plugin-transition';
import { PlayerSystem } from './components/player';
import { WeaponComponent, WeaponSystem } from './components/weapon';
import { EnemySystem, EnemyComponent } from './components/enemy';
import { MapSystem } from './components/map';
import { WaveSystem, WaveComponent } from './components/wave';
import { GameLogSystem } from './components/log';
import { ClockComponent } from './components/clock';
import * as prefab from './prefab';

export default class GameScript {
  userData: EVAGame.IGameData;
  game!: Game;
  player!: GameObject;
  enemys: GameObject[] = [];
  weapons: GameObject[] = [];

  constructor(userData: EVAGame.IGameData) {
    this.userData = userData;
  }

  private initGame(canvasEl: HTMLCanvasElement) {
    const canvasWidth = canvasEl.offsetWidth;
    const canvasHeight = canvasEl.offsetHeight;
    const sceneWidth = 750;
    const sceneHeight = canvasHeight / canvasWidth * 750;

    this.game = new Game(({
      frameRate: 60,
      autoStart: false,
      systems: [
        new WeaponSystem(this.userData.baseDamage),
        new EnemySystem(),
        new WaveSystem(this.userData.waves),
        new PlayerSystem(),
        new MapSystem({
          // helper: true,
          width: sceneWidth,
          height: sceneHeight,
          ...this.userData.map,
        }),
        // new GameLogSystem(),
        new RendererSystem({
          canvas: canvasEl,
          width: sceneWidth,
          height: sceneHeight,
          transparent: true,
          resoution: 0.5,
        }),
        new TextSystem(),
        new EventSystem(),
        new GraphicsSystem(),
        new DragonBoneSystem(),
        new ImgSystem(),
        new TransitionSystem(),
        new RenderSystem(),
      ],
    }));
  }

  private addPlayer() {
    this.player = prefab.player({
      data: this.userData.player,
      ...this.userData.player.position,
    });

    const event = this.player.getComponent(Event);
    event.emit('playIdle', Infinity);

    this.game.scene.addChild(this.player);
  }

  private addWeapons() {
    for (const data of this.userData.weapons) {
      const weapon = prefab.weapon({
        data,
        ...data.position,
      });
      this.game.scene.addChild(weapon);
      this.weapons.push(weapon);
    }
  }

  private initScene() {
    this.addPlayer();
    this.addWeapons();
    this.game.scene.addComponent(new ClockComponent());
    this.game.scene.addComponent(new WaveComponent());
  }

  init(canvasEl: HTMLCanvasElement) {
    this.initGame(canvasEl);
    this.initScene();
  }

  private addEnemy(element: EVAGame.IEnemy['element'], position: {x: number, y: number}) {
    const data = this.userData.enemys.find((enemy) => enemy.element === element);

    if (data) {
      const enemy = prefab.enemy({
        data,
        ...position,
      });
      this.game.scene.addChild(enemy);
      return enemy;
    }

    return undefined;
  }

  private async startWave() {
    const clockComponent = this.game.scene.getComponent(ClockComponent);

    for (const { element, enterTime, position } of this.userData.waves) {
      const { pastTime } = clockComponent;

      if (pastTime < enterTime) {
        await clockComponent.delay(enterTime - pastTime);
      }

      const enemy = this.addEnemy(element, position);

      if (enemy) {
        this.enemys.push(enemy);

        const enemyComponent = enemy.getComponent(EnemyComponent);
        enemyComponent.enter();
        enemyComponent.move();
      }
    }
  }

  private async startAttack() {
    for (const weapon of this.weapons) {
      const weaponComponent = weapon.getComponent(WeaponComponent);
      weaponComponent.on('attack', () => this.attackEffect(weaponComponent.element))
      weaponComponent.attack();
    }
  }

  private async attackEffect(element: EVAGame.element) {
    const bullet = prefab.bullet({
      data: {
        element,
      },
      x: 3,
      y: 10
    });

    this.game.scene.addChild(bullet);

    const event = bullet.getComponent(Event);
    event.on('fireend', () => bullet.remove());
    event.emit('fire', 1);
  }

  start() {
    this.game.start();
    this.startWave();
    this.startAttack();

    return new Promise((resolve) => {
      this.game.once('result', (result) => {
        resolve(result);
      });
    });
  }

  pause() {
    this.game.pause();
  }

  destory() {
    this.game.destroy();
  }
}