import React from 'react';
import { EVAGame } from '../../eva-game-types';
import './index.css';

interface IWeaponComponentProps {
  weapon: EVAGame.IWeapon;
  onSelected: (element: EVAGame.element) => void;
  selected: boolean;
}

export default function Weapon({ weapon, onSelected, selected }: IWeaponComponentProps) {
  const select = () => {
    onSelected(weapon.element);
  };

  return (
    <div className="weapon" onClick={select}>
      <div className={selected ? 'weapon_building_bg element-selected' : 'weapon_building_bg element-unselect'} />
      <div className="weapon_building">
        <div className={`weapon_building_img element-${weapon.element}`} />
      </div>
      <div className={`weapon_badge element-badge-${weapon.element}`} />
      <div className="level">{`LV ${weapon.level}`}</div>
    </div>
  );
}
