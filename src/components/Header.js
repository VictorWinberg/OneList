import React from 'react';
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
        <img
          id="settingicon"
          src="/icons/settings_icon.png"
          alt="Settings"
          height="30px"
        />
      </div>
      <nav>
        <ul>
          <li>Inköpslista</li>
          <li>Kategorier</li>
          <li>Dela</li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
