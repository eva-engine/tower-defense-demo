export namespace EVAGame {
  interface IPlayer {
    HP: number;
    Gold: number;
    position: {
      x: number;
      y: number;
    };
  }

  interface IMap {
    distance: number;
    column: number;
    row: number;
  }

  interface IWave {
    element: element;
    enterTime: number;
    position: {
      x: number;
      y: number;
    };
  }

  type element = 'normal' | 'fire' | 'water' | 'wood';

  interface IElementalDamage {
    normal: number;
    fire: number;
    water: number;
    wood: number;
  }

  interface IWeapon {
    name: string;
    info: string;
    level: number;
    element: element;
    cost: number;
    damage: IElementalDamage;
    cd: number;
    delay: number;
    position: {
      x: number;
      y: number;
    };
  }

  interface IEnemy {
    name: string;
    element: element;
    HP: number;
    damage: number;
    resistance: IElementalDamage;
    speed: number;
  }

  interface IElementBadge {
    element: element;
    width: number;
    height: number;
    positionX: number;
    positionY: number;
    originX: number;
    originY: number;
  }

  interface IGameData {
    baseDamage: IElementalDamage;
    map: IMap;
    player: IPlayer;
    weapons: IWeapon[];
    enemys: IEnemy[];
    waves: IWave[];
  }
}
