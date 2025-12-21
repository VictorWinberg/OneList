import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import onelisticon from '../../assets/icons/onelist.svg';
import settingicon from '../../assets/icons/settings.svg';

const Header = () => {
  const { t } = useTranslation();

  return (
    <div className="header">
      <div className="top">
        <img id="headericon" src={onelisticon} alt="Settings" height="30px" />
        <h1>OneList</h1>
        <NavLink to="/settings">
          <img id="settingicon" src={settingicon} alt="Settings" height="28px" />
        </NavLink>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink exact to="/">
              {t('nav.shoppinglist')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories">{t('nav.categories')}</NavLink>
          </li>
          <li>
            <NavLink to="/products">{t('nav.products')}</NavLink>
          </li>
          <li>
            <NavLink to="/shopping-history">{t('nav.shoppingHistory')}</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
