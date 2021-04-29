import { EVAGame } from '../../eva-game-types';
import { Component, System, decorators, GameObject } from '@eva/eva.js';
import { Graphics } from '@eva/plugin-renderer-graphics';
import { GameLogComponent } from './log';

export interface MapParams {
  origin?: {
    x?: number;
    y?: number;
  };
  anchor?: {
    x?: number;
    y?: number;
  };
  position: {
    x: number;
    y: number;
  };
}

export class MapComponent extends Component {
  static componentName = 'map';
  transform!: MapParams;
  x!: number;
  y!: number;

  constructor(params: MapParams) {
    super(params);
  }

  init(transform: MapParams) {
    this.transform = transform;
    this.x = transform.position.x;
    this.y = transform.position.y;
  }
}

export interface MapSystemParams extends EVAGame.IMap {
  width: number;
  height: number;
  helper?: boolean;
}

export interface MapGrid {
  position: {
    x: number;
    y: number;
  };
}

@decorators.componentObserver({
  map: ['x', 'y'],
})
class MapSystem extends System {
  static systemName = 'map';

  ceil: {
    width: number;
    height: number;
  } = {
    width: 0,
    height: 0,
  };
  routeDistance!: number;
  helper!: boolean;
  grids: MapGrid[][] = [];

  private width!: number;
  private height!: number;
  private column!: number;
  private row!: number;

  constructor(params: MapSystemParams) {
    super(params);
  }

  init({
    width,
    height,
    column,
    row,
    distance,
    helper = false,
  }: MapSystemParams) {
    this.width = width;
    this.height = height;
    this.column = column;
    this.row = row;
    this.routeDistance = distance;
    this.helper = helper;
    this.ceil.width = Math.floor(width / column);
    this.ceil.height = Math.floor(height / row);

    for (let i = 0; i < row; i++) {
      this.grids[i] = [];

      for (let j = 0; j < column; j++) {
        this.grids[i].push({
          position: {
            x: j * this.ceil.width,
            y: i * this.ceil.height,
          },
        });
      }
    }
  }

  start() {
    if (this.helper) {
      const gridHelper = new GameObject('mapGridHelper', {
        size: {
          width: this.width,
          height: this.height,
        },
      });

      const gridLine = gridHelper.addComponent(new Graphics());
      gridLine.graphics.lineStyle(2, 0xcccccc, 1);

      for (let i = 0; i < this.row; i++) {
        gridLine.graphics.moveTo(this.grids[i][0].position.x, this.grids[i][0].position.y);
        gridLine.graphics.lineTo(this.grids[i][this.column - 1].position.x + this.ceil.width, this.grids[i][this.column - 1].position.y);
      }

      for (let j = 0; j < this.column; j++) {
        gridLine.graphics.moveTo(this.grids[0][j].position.x, this.grids[0][j].position.y);
        gridLine.graphics.lineTo(this.grids[this.row - 1][j].position.x, this.grids[this.row - 1][j].position.y + this.ceil.height);
      }

      this.game.scene.addChild(gridHelper);
    }
  }

  update() {
    const componentChanged = this.componentObserver.clear();

    for (const changed of componentChanged) {
      const { gameObject, component } = changed;

      if (!gameObject) continue;

      const logComponent = gameObject.getComponent(GameLogComponent);

      if (component instanceof MapComponent && gameObject.transform) {
        let { x, y } = this.grids[component.y - 1][component.x - 1].position;
        x += this.ceil.width * (component.transform?.anchor?.x || 0);
        y += this.ceil.height * (component.transform?.anchor?.y || 0);
        x -= gameObject.transform.size.width * (component.transform?.origin?.x || 0);
        y -= gameObject.transform.size.height * (component.transform?.origin?.y || 0);

        gameObject.transform.position.x = x;
        gameObject.transform.position.y = y;

        logComponent.debug(`move to [${component.x}, ${component.y}]`);
      }
    }
  }

  onDestroy() {}
}

export { MapSystem };
