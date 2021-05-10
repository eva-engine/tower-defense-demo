import { useCallback } from 'react';
import './index.css';

interface IResultProps {
  result: any;
}

export default function Result({result}: IResultProps) {

  const reset = useCallback(() => {
    window.location.replace(`?t=${Date.now()}`);
  }, []);

  if (result === null) {
    return null;
  }

  return (
    <div className="result">
        <div className="text">
          <div className="title">
            {
              result?.win ? 
                <div className="win"><h2>You <b>Win!</b></h2></div>
                :
                <div className="lose">
                  <h2>You <b>Lose!</b></h2>
                  <span>可以调整塔的级别试试哦！</span>
                </div>
            } 
          </div>
          <div className="staff">
            <ul>
              <li><i className="icon normal-weapon-icon " /><b>策划：</b><i>齐纪</i></li>
              <li><i className="icon fire-weapon-icon" /><b>产品：</b><i>眀非</i></li>
              <li><i className="icon water-weapon-icon" /><b>产品：</b><i>蕴光</i></li>
              <li><i className="icon wood-weapon-icon" /><b>数值：</b><i>光驰</i></li>
              <li><i className="icon eva-icon" /><b>质量：</b><i>以顺</i></li>
            </ul>
            <ul>
              <li><i className="icon normal-enemy-icon" /><b>原画：</b><i>夜翎</i></li>
              <li><i className="icon fire-enemy-icon" /><b>美术：</b><i>异铭</i></li>
              <li><i className="icon water-enemy-icon" /><b>程序：</b><i>渚薰</i></li>
              <li><i className="icon wood-enemy-icon" /><b>程序：</b><i>宵乐</i></li>
            </ul>
          </div>
          <h3><i className="icon brand-icon" /><a href="https://www.yuque.com/eva/blog/intro">淘系互动@copyright</a></h3>
        </div>
        <div className="button" onClick={reset}>RESTART</div>
      </div>
  )
}