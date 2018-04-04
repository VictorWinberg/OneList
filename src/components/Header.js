import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/Header.css';
// import PropTypes from 'prop-types';

function Header() {
  return (
    <div>
      <div className="top">
        <img
          id="headericon"
          src="/icons/onelist-48x48.png"
          alt="Settings"
          height="30px"
        />
        <h1>OneList</h1>
        <Link to="/settings">
          <img
            id="settingicon"
            src="/icons/settings_icon.png"
            alt="Settings"
            height="30px"
          />
        </Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Inköpslista</Link>
          </li>
          <li>
            <Link to="/categories">Kategorier</Link>
          </li>
          <li>
            <Link to="/share">Dela</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
