import { EVAGame } from '../eva-game-types';

export const GameData: EVAGame.IGameData = {
  baseDamage: {
    normal: 1,
    fire: 1,
    water: 1,
    wood: 1,
  },
  map: {
    distance: 10,
    column: 5,
    row: 13,
  },
  player: {
    HP: 4,
    Gold: 290,
    position: {
      x: 3,
      y: 12,
    },
  },
  weapons: [
    {
      name: '普通',
      info: '普通攻击属性武器',
      element: 'normal',
      level: 1,
      cost: 14,
      damage: {
        normal: 1,
        fire: 0,
        water: 0,
        wood: 0,
      },
      cd: 500,
      delay: 100,
      position: {
        x: 1,
        y: 12,
      },
    },
    {
      name: '火系',
      info: '火系攻击属性武器',
      element: 'fire',
      level: 1,
      cost: 16,
      damage: {
        normal: 0.6,
        fire: 1.2,
        water: 0.1,
        wood: 0,
      },
      cd: 900,
      delay: 200,
      position: {
        x: 2,
        y: 12,
      },
    },
    {
      name: '水系',
      info: '水系攻击属性武器',
      element: 'water',
      level: 1,
      cost: 18,
      damage: {
        normal: 1,
        fire: 0,
        water: 5,
        wood: 0,
      },
      cd: 2000,
      delay: 500,
      position: {
        x: 4,
        y: 12,
      },
    },
    {
      name: '木系',
      info: '木系攻击属性武器',
      element: 'wood',
      level: 1,
      cost: 24,
      damage: {
        normal: 1.8,
        fire: 0,
        water: 0,
        wood: 4.5,
      },
      cd: 1500,
      delay: 500,
      position: {
        x: 5,
        y: 12,
      },
    },
  ],
  enemys: [
    {
      name: '普通史莱姆',
      element: 'normal',
      HP: 350,
      damage: 1,
      resistance: {
        normal: 1,
        fire: 0.5,
        water: 0.5,
        wood: 0.5,
      },
      speed: 1.2,
    },
    {
      name: '火系史莱姆',
      element: 'fire',
      HP: 500,
      damage: 1,
      resistance: {
        normal: 0.8,
        fire: 1,
        water: 2,
        wood: 0,
      },
      speed: 1,
    },
    {
      name: '水系史莱姆',
      element: 'water',
      HP: 470,
      damage: 1,
      resistance: {
        normal: 0.8,
        fire: 0,
        water: 1,
        wood: 2,
      },
      speed: 1.25,
    },
    {
      name: '木系史莱姆',
      element: 'wood',
      HP: 190,
      damage: 1,
      resistance: {
        normal: 0.8,
        fire: 2,
        water: 0,
        wood: 1,
      },
      speed: 2.5,
    },
  ],
  waves: [
    {
      element: 'normal',
      enterTime: 600,
      position: {
        x: 1,
        y: 1,
      },
    },
    {
      element: 'fire',
      enterTime: 1000,
      position: {
        x: 2,
        y: 1,
      },
    },
    {
      element: 'water',
      enterTime: 1300,
      position: {
        x: 3,
        y: 1,
      },
    },
    {
      element: 'wood',
      enterTime: 1600,
      position: {
        x: 4,
        y: 1,
      },
    },
    {
      element: 'normal',
      enterTime: 2900,
      position: {
        x: 4,
        y: 1,
      },
    },
    {
      element: 'water',
      enterTime: 3000,
      position: {
        x: 5,
        y: 1,
      },
    },
    {
      element: 'wood',
      enterTime: 3300,
      position: {
        x: 5,
        y: 1,
      },
    },
    {
      element: 'water',
      enterTime: 3500,
      position: {
        x: 2,
        y: 1,
      },
    },
    {
      element: 'fire',
      enterTime: 4000,
      position: {
        x: 3,
        y: 1,
      },
    },
    {
      element: 'normal',
      enterTime: 4700,
      position: {
        x: 4,
        y: 1,
      },
    },
    {
      element: 'wood',
      enterTime: 6300,
      position: {
        x: 1,
        y: 1,
      },
    },
    {
      element: 'normal',
      enterTime: 6800,
      position: {
        x: 5,
        y: 1,
      },
    },
    {
      element: 'water',
      enterTime: 7500,
      position: {
        x: 4,
        y: 1,
      },
    },
    {
      element: 'fire',
      enterTime: 8000,
      position: {
        x: 2,
        y: 1,
      },
    },
  ],
};

export const UserData: EVAGame.IGameData = {
  baseDamage: {
    ...GameData.baseDamage,
  },
  player: {
    ...GameData.player,
  },
  map: {
    ...GameData.map,
  },
  weapons: GameData.weapons.map((weapon) => ({
    ...weapon,
  })),
  enemys: GameData.enemys.map((enemy) => ({
    ...enemy,
  })),
  waves: GameData.waves.map((wave) => ({
    ...wave,
  })),
};
