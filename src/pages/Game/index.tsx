import { createElement, useEffect, useRef, useState } from 'react';
import { UserData } from '../../data';
import GameScript from '../../scripts/game';
import Result from '../../components/Result';
import './index.css';

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const game = new GameScript(UserData);

  useEffect(() => {
    if (result === null && canvasEl.current) {
      game.init(canvasEl.current);
      game.start()
        .then((result) => {
          setResult(result);
        });
    }
  }, [result]);

  return (
    <div className="game">
      <canvas ref={canvasEl} />
      <Result result={result} />
    </div>
  );
}
