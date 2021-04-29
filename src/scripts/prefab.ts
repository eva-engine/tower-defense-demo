import { GameObject, RESOURCE_TYPE, resource } from '@eva/eva.js';
import { Graphics } from '@eva/plugin-renderer-graphics';
import { DragonBone } from '@eva/plugin-renderer-dragonbone';
import { Event } from '@eva/plugin-renderer-event';
import { Text } from '@eva/plugin-renderer-text';
import { Img } from '@eva/plugin-renderer-img';
import { Render } from '@eva/plugin-renderer-render';
import { Transition } from '@eva/plugin-transition';
import { EVAGame } from '../eva-game-types';
import { PlayerComponent } from './components/player';
import { WeaponComponent } from './components/weapon';
import { EnemyComponent } from './components/enemy';
import { MapComponent } from './components/map';
import { GameLogComponent } from './components/log';

interface GraphicResource {
  color: number;
  shape: 'rect' | 'star' | 'circle';
}

interface ImageResource {
  name: string;
  type: RESOURCE_TYPE.IMAGE;
  src: {
    image: {
      type: 'png';
      url: string;
    };
  };
  preload: boolean;
}
interface DragonBoneResource {
  name: string;
  type: RESOURCE_TYPE.DRAGONBONE;
  src: {
    image: {
      type: 'png';
      url: string;
    };
    tex: {
      type: 'json';
      url: string;
    };
    ske: {
      type: 'json';
      url: string;
    };
  };
  preload: boolean;
}

interface ICreateParams {
  name: string;
  width?: number;
  height?: number;
  scale?: number;
  x: number;
  y: number;
  graphic?: GraphicResource;
  image?: {
    resource: string;
  };
  dragonebone?: {
    resource: string;
    armatureName: string;
    animationName: string;
  };
}

interface IPrefabParams<T> {
  data: T;
  x: number;
  y: number;
}

function createGameObject({
  name,
  width = 0,
  height = 0,
  scale = 1,
  x,
  y,
  graphic,
  image,
  dragonebone,
}: ICreateParams): GameObject {
  const gameObject = new GameObject(name, {
    size: {
      width,
      height,
    },
    scale: {
      x: scale,
      y: scale,
    },
  });

  const event = gameObject.addComponent(new Event());

  gameObject.addComponent(new GameLogComponent());

  gameObject.addComponent(
    new MapComponent({
      anchor: {
        x: 0.5,
        y: 0.5,
      },
      origin: {
        x: 0.5,
        y: 0.5,
      },
      position: {
        x,
        y,
      },
    }),
  );

  if (graphic) {
    const box = gameObject.addComponent(new Graphics());
    box.graphics.beginFill(graphic.color, 1);
    switch (graphic.shape) {
      case 'rect': {
        box.graphics.drawRect(0, 0, width, height);
        break;
      }
      case 'circle': {
        box.graphics.drawCircle(width / 2, height / 2, width / 2);
        break;
      }
      case 'star': {
        box.graphics.drawStar(width / 2, height / 2, 5, width / 2);
        break;
      }
    }
    box.graphics.endFill();
  }

  if (image) {
    gameObject.addComponent(
      new Img({
        resource: image.resource,
      }),
    );
  }

  if (dragonebone) {
    const anime = gameObject.addComponent(
      new DragonBone({
        resource: dragonebone.resource,
        armatureName: dragonebone.armatureName,
        autoPlay: false,
      }),
    );

    event.on('playIdle', (times = 1) => {
      anime.play(dragonebone.animationName, times);
    });
  }

  return gameObject;
}

const playerResource: (DragonBoneResource | ImageResource)[] = [{
  name: 'player',
  type: RESOURCE_TYPE.DRAGONBONE,
  src: {
    image: {
      type: 'png',
      url: '/assets/dragonbone/robot/TB13RfXrwgP7K4jSZFqXXamhVXa-256-256.png',
    },
    tex: {
      type: 'json',
      url: '/assets/dragonbone/robot/649a2382b6e70d4d3d9096301e1e9b0e.json',
    },
    ske: {
      type: 'json',
      url: '/assets/dragonbone/robot/9f25675eaad7275307f4969cbad4fe99.json',
    },
  },
  preload: true,
},{
  name: 'player-heart',
  type: RESOURCE_TYPE.IMAGE,
  src: {
    image: {
      type: 'png',
      url: '/assets/image/heart.png',
    },
  },
  preload: true
}];

export function player({ data, x, y }: IPrefabParams<EVAGame.IPlayer>): GameObject {
  const gameObject = createGameObject({
    name: 'player',
    x,
    y,
    scale: 0.5,
    dragonebone: {
      resource: 'player',
      armatureName: 'robot',
      animationName: 'newAnimation',
    },
  });
  gameObject.addComponent(new PlayerComponent(data));

  const heart = new GameObject('player-heart', {
    size: {
      width: 60,
      height: 60,
    },
    origin: {
      x: 0.5,
      y: 0.5,
    },
    position: {
      x: -20,
      y: -240,
    }
  });

  heart.addComponent(new Img({
    resource: 'player-heart'
  }));

  const hp = new GameObject('player-hp', {
    origin: {
      x: 0.5,
      y: 0.5,
    },
    position: {
      x: 50,
      y: -240
    }
  });

  hp.addComponent(new Text({
    text: data.HP,
    style: {
      fontSize: 60,
      fill: 0xD81E06,
      stroke: 0xffffff,
      strokeThickness: 10,
    }
  }));

  gameObject.addChild(heart);
  gameObject.addChild(hp);

  return gameObject;
}

const weaponResources: DragonBoneResource[] = [
  {
    name: 'normal-weapon',
    type: RESOURCE_TYPE.DRAGONBONE,
    src: {
      image: {
        type: 'png',
        url: '/assets/dragonbone/normal-weapon/TB1D1mM4Lb2gK0jSZK9XXaEgFXa-256-256.png',
      },
      tex: {
        type: 'json',
        url: '/assets/dragonbone/normal-weapon/53f7268e6db5a0d8aa7765e721d6c50c.json',
      },
      ske: {
        type: 'json',
        url: '/assets/dragonbone/normal-weapon/6a0de7df81565d7eeee74a7a5d5c90a2.json',
      },
    },
    preload: true,
  },
  {
    name: 'fire-weapon',
    type: RESOURCE_TYPE.DRAGONBONE,
    src: {
      image: {
        type: 'png',
        url: '/assets/dragonbone/fire-weapon/TB1Y65H4KL2gK0jSZPhXXahvXXa-256-256.png',
      },
      tex: {
        type: 'json',
        url: '/assets/dragonbone/fire-weapon/2d18bc3f44529c8bb0745230b2008331.json',
      },
      ske: {
        type: 'json',
        url: '/assets/dragonbone/fire-weapon/bf59a0d33ba196fdf17401cc2ff35d04.json',
      },
    },
    preload: true,
  },
  {
    name: 'water-weapon',
    type: RESOURCE_TYPE.DRAGONBONE,
    src: {
      image: {
        type: 'png',
        url: '/assets/dragonbone/water-weapon/TB1zsuL4Uz1gK0jSZLeXXb9kVXa-256-256.png',
      },
      tex: {
        type: 'json',
        url: '/assets/dragonbone/water-weapon/fcc75c846bc10c6631a282218cbb77e4.json',
      },
      ske: {
        type: 'json',
        url: '/assets/dragonbone/water-weapon/469a8af43daec65b35d9d9a0a257a472.json',
      },
    },
    preload: true,
  },
  {
    name: 'wood-weapon',
    type: RESOURCE_TYPE.DRAGONBONE,
    src: {
      image: {
        type: 'png',
        url: '/assets/dragonbone/wood-weapon/TB12teOt_M11u4jSZPxXXahcXXa-256-256.png',
      },
      tex: {
        type: 'json',
        url: '/assets/dragonbone/wood-weapon/42726fc745c6e3c227a9c8d28865d49d.json',
      },
      ske: {
        type: 'json',
        url: '/assets/dragonbone/wood-weapon/6bad23c6f2966b0c952a95cb2fdce202.json',
      },
    },
    preload: true,
  },
];

const weaponArmatures = {
  normal: 'slimer_nor',
  fire: 'tower_fire',
  water: 'arms-water',
  wood: 'weapon_mu',
};

export function weapon({ data, x, y }: IPrefabParams<EVAGame.IWeapon>): GameObject {
  const gameObject = createGameObject({
    name: `${data.element}-weapon`,
    scale: 0.7,
    x,
    y,
    dragonebone: {
      resource: `${data.element}-weapon`,
      armatureName: weaponArmatures[data.element],
      animationName: 'newAnimation',
    },
  });
  gameObject.addComponent(new WeaponComponent(data));

  const text = new GameObject(`${data.element}-weapon`, {
    position: {
      x: 0,
      y: 120,
    },
    origin: {
      x: 0.5,
      y: 0.5,
    },
  });

  text.addComponent(
    new Text({
      text: `LV ${data.level}`,
      style: {
        fontSize: 40,
        fill: 0xffffff,
      },
    }),
  );

  gameObject.addChild(text);

  return gameObject;
}

const bulletResources: ImageResource[] = [
  {
    name: 'normal-bullet',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '/assets/image/normal-bullet.png',
      },
    },
    preload: true,
  },
  {
    name: 'fire-bullet',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '/assets/image/fire-bullet.png',
      },
    },
    preload: true,
  },
  {
    name: 'water-bullet',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '/assets/image/water-bullet.png',
      },
    },
    preload: true,
  },
  {
    name: 'wood-bullet',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '/assets/image/wood-bullet.png',
      },
    },
    preload: true,
  },
];

export function bullet({ data, x, y }: IPrefabParams<{ element: EVAGame.element }>): GameObject {
  const gameObject = createGameObject({
    name: `${data.element}-weapon`,
    width: 750,
    height: 1334,
    x,
    y,
    image: {
      resource: `${data.element}-bullet`,
    },
  });

  const render = gameObject.addComponent(
    new Render({
      alpha: 0,
    }),
  );

  gameObject.removeComponent(MapComponent);

  const animation = gameObject.addComponent(new Transition());

  animation.group = {
    fire: [
      {
        name: 'alpha',
        component: render,
        values: [
          {
            time: 0,
            value: 0,
            tween: 'ease-in',
          },
          {
            time: 50,
            value: 1,
            tween: 'linear',
          },
          {
            time: 350,
            value: 1,
            tween: 'ease-out',
          },
          {
            time: 400,
            value: 0,
          },
        ],
      },
      {
        name: 'position.y',
        component: gameObject.transform,
        values: [
          {
            time: 0,
            value: 300,
            tween: 'ease-out',
          },
          {
            time: 400,
            value: -100,
          },
        ],
      },
    ],
  };

  const event = gameObject.getComponent(Event);

  event.on('fire', (times = 1) => {
    animation.play('fire', times);
    animation.once('finish', () => event.emit('fireend'));
  });

  return gameObject;
}

const enemyResources: (DragonBoneResource | ImageResource)[] = [
  {
    name: 'normal-enemy',
    type: RESOURCE_TYPE.DRAGONBONE,
    src: {
      image: {
        type: 'png',
        url: '/assets/dragonbone/enemy-normal/TB1XrNR4UY1gK0jSZFMXXaWcVXa-256-256.png',
      },
      tex: {
        type: 'json',
        url: '/assets/dragonbone/enemy-normal/86d3a8d59acaf29d24c8db90a8c2113e.json',
      },
      ske: {
        type: 'json',
        url: '/assets/dragonbone/enemy-normal/c8c2a5ab1f07ec118d8341770b025377.json',
      },
    },
    preload: true,
  },
  {
    name: 'water-enemy',
    type: RESOURCE_TYPE.DRAGONBONE,
    src: {
      image: {
        type: 'png',
        url: '/assets/dragonbone/enemy-water/TB155BQ4FT7gK0jSZFpXXaTkpXa-256-256.png',
      },
      tex: {
        type: 'json',
        url: '/assets/dragonbone/enemy-water/9e750ffd7a4e22de9a1b07f2c2d647be.json',
      },
      ske: {
        type: 'json',
        url: '/assets/dragonbone/enemy-water/d54d187987edd2f9301a0954b0457673.json',
      },
    },
    preload: true,
  },
  {
    name: 'fire-enemy',
    type: RESOURCE_TYPE.DRAGONBONE,
    src: {
      image: {
        type: 'png',
        url: '/assets/dragonbone/enemy-fire/TB1xcFzqQcx_u4jSZFlXXXnUFXa-256-256.png',
      },
      tex: {
        type: 'json',
        url: '/assets/dragonbone/enemy-fire/9aa0f6c67e7f4b674ecbdd14d6261434.json',
      },
      ske: {
        type: 'json',
        url: '/assets/dragonbone/enemy-fire/9f628e03da2e9ee5f441d496d68167e0.json',
      },
    },
    preload: true,
  },
  {
    name: 'wood-enemy',
    type: RESOURCE_TYPE.DRAGONBONE,
    src: {
      image: {
        type: 'png',
        url: '/assets/dragonbone/enemy-wood/TB1sbpZ4UY1gK0jSZFCXXcwqXXa-256-256.png',
      },
      tex: {
        type: 'json',
        url: '/assets/dragonbone/enemy-wood/8c54ab67e9abdb571749403a51b0f3e1.json',
      },
      ske: {
        type: 'json',
        url: '/assets/dragonbone/enemy-wood/deb0c3308470969e2fd6a455be4fb368.json',
      },
    },
    preload: true,
  },
  {
    name: 'normal-enemy-badge',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '/assets/image/element_badge_normal.png',
      },
    },
    preload: true,
  },
  {
    name: 'fire-enemy-badge',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '/assets/image/element_badge_fire.png',
      },
    },
    preload: true,
  },
  {
    name: 'water-enemy-badge',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '/assets/image/element_badge_water.png',
      },
    },
    preload: true,
  },
  {
    name: 'wood-enemy-badge',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: '/assets/image/element_badge_wood.png',
      },
    },
    preload: true,
  },
];

const enemyConfig = {
  normal: {
    scale: 0.6,
    armatureName: 'slimer_mu',
  },
  fire: {
    scale: 0.5,
    armatureName: 'slimer_fire',
  },
  water: {
    scale: 0.6,
    armatureName: 'slimer_water',
  },
  wood: {
    scale: 0.45,
    armatureName: 'slimer_mu-01',
  },
}

export function enemy({ data, x, y }: IPrefabParams<EVAGame.IEnemy>): GameObject {
  const config = enemyConfig[data.element];

  const gameObject = createGameObject({
    name: `${data.element}-enemy`,
    scale: config.scale,
    x,
    y,
    dragonebone: {
      resource: `${data.element}-enemy`,
      armatureName: config.armatureName,
      animationName: 'newAnimation',
    },
  });

  gameObject.addComponent(new EnemyComponent(data));

  const badge = new GameObject('badge', {
    size: {
      width: 60,
      height: 60,
    },
    position: {
      x: -80,
      y: -120,
    },
    origin: {
      x: 0.5,
      y: 0.5,
    },
  });
  badge.addComponent(
    new Img({
      resource: `${data.element}-enemy-badge`,
    }),
  );

  const healthBarBorder = new GameObject('health-bar-border', {
    position: {
      x: 20,
      y: -120,
    },
    origin: {
      x: 0.5,
      y: 0.5,
    },
    size: {
      width: 160,
      height: 32,
    },
  });
  const healthBarBorderGraphc = healthBarBorder.addComponent(new Graphics());
  healthBarBorderGraphc.graphics.beginFill(0xffffff, 1);
  healthBarBorderGraphc.graphics.drawRoundedRect(0, 0, 160, 32, 12);
  healthBarBorderGraphc.graphics.endFill();

  const healthBar = new GameObject('health-bar', {
    position: {
      x: -60,
      y: -132,
    },
    size: {
      width: 150,
      height: 24,
    },
  });
  const healthBarGraphic = healthBar.addComponent(new Graphics());
  healthBarGraphic.graphics.beginFill(0xde3249, 1);
  healthBarGraphic.graphics.drawRoundedRect(0, 0, 150, 24, 9);
  healthBarGraphic.graphics.endFill();

  gameObject.addChild(badge);
  gameObject.addChild(healthBarBorder);
  gameObject.addChild(healthBar);

  return gameObject;
}

resource.addResource([
  ...playerResource,
  ...weaponResources,
  ...enemyResources,
  ...bulletResources
]);

resource.preload();
