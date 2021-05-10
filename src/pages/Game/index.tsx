import { useEffect, useRef, useState, memo } from 'react';
import { UserData } from '../../data';
import GameScript from '../../scripts/game';
import Result from '../../components/Result';
import './index.css';

function Game() {
  const [result, setResult] = useState<any>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let game: GameScript;
    if (result === null && canvasEl.current) {
      game = new GameScript(UserData);
      game.init(canvasEl.current);
      game.start()
        .then((result) => {
          setResult(result);
        });
    }

    return () => game.destory()
  }, [result]);

  return (
    <div className="game">
      <canvas ref={canvasEl} />
      <Result result={result} />
    </div>
  );
}

export default memo(Game);