import { createElement, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserData } from '../../data';
import { EVAGame } from '../../eva-game-types';
import Weapon from '../../components/Weapon';
import WeaponDetail from '../../components/WeaponDetail';
import './index.css';

export default function Home() {
  const history = useHistory();

  const [gold, setGold] = useState(UserData.player.Gold);

  const [selectedWeapon, setSelectedWeapon] = useState(UserData.weapons[0].element);

  const onWeaponSelect = useCallback((element: EVAGame.element) => {
    setSelectedWeapon(element);
  }, []);

  const onWeaponLvChange = useCallback((cost: number) => {
    UserData.player.Gold -= cost;
    setGold(UserData.player.Gold);
  }, []);

  const onStart = useCallback(() => {
    history.push('/game')
  }, []);

  return (
    <div className="app">
      <div className="nav">
        <div className="gold">{gold}</div>
        <a href="https://eva.js.org/evajs-open/pages/demo.htm" className="eva" />
      </div>
      <div className="weapons">
        {
          UserData.weapons.map(weapon => (
            <Weapon
              weapon={weapon}
              onSelected={onWeaponSelect}
              selected={weapon.element === selectedWeapon}
              key={weapon.element}
            />
          ))
        }
      </div>
      <div className="separator">
        <div className="separator-img"></div>
      </div>
      <div className="weapon-detail">
        {
          UserData.weapons.map(weapon => (
            <WeaponDetail
              weapon={weapon}
              restGold={gold}
              onLvChange={onWeaponLvChange}
              selected={weapon.element === selectedWeapon}
              key={weapon.element}
            />
          ))
        }
      </div>
      <div className="start" onClick={onStart}></div>
    </div>
  );
}