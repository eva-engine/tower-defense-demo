import { useState } from 'react';
import { EVAGame } from '../../eva-game-types';
import './index.css';

interface IWeaponDetailComponentProps {
  weapon: EVAGame.IWeapon;
  restGold: number;
  onLvChange: (cost: number) => void;
  selected: boolean;
}

export default function WeaponDetail({ weapon, selected, restGold, onLvChange }: IWeaponDetailComponentProps) {
  const [level, setLevel] = useState(weapon.level);

  const onDowngradeChange = () => {
    if (weapon.level === 1) {
      return;
    }

    weapon.level -=1
    setLevel(weapon.level);
    onLvChange(-weapon.cost);
  };

  const onUpgradeChange = () => {
    if (restGold - weapon.cost < 0) {
      return;
    }

    weapon.level += 1;
    setLevel(weapon.level);
    onLvChange(weapon.cost);
  };

  return (
    <div className="weapon_card" style={{ display: selected ? 'flex' : 'none' }}>
      <div className="weapon_card-intro">
        <div className="weapon_card-img_wrap">
          <div className={`weapon_card-img element-${weapon.element}`}></div>
          <div className={`weapon_card-badge element-badge-${weapon.element}`} />
        </div>
        <div className="weapon_card-upgrade_wrap">
          <div className="weapon_card-drowngrade" onClick={onDowngradeChange}></div>
          <div className="weapon_card-lv">{`LV ${level}`}</div>
          <div className="weapon_card-upgrade" onClick={onUpgradeChange}></div>
        </div>
      </div>
      <div className="weapon_card-body">
        <div className="weapon_card-title">
          <div className="weapon_card-name">{`${weapon.name}`}</div>
          <div className="weapon_card-cost_wrap">
            <div className="weapon_card-unit"></div>
            <div className="weapon_card-cost">{`${weapon.cost}`}</div>
          </div>
        </div>
        <div className="weapon_card-info">{weapon.info}</div>
      </div>
    </div>
  );
}
