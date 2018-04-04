import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTranslate } from 'react-localize-redux';

import '../styles/Header.css';

const Header = ({ translate }) => (
  <div>
    <div className="top">
      <img
        id="headericon"
        src="/icons/onelist.svg"
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
          <Link to="/">{translate('shoppinglist')}</Link>
        </li>
        <li>
          <Link to="/categories">{translate('categories')}</Link>
        </li>
        <li>
          <Link to="/share">{translate('share')}</Link>
        </li>
      </ul>
    </nav>
  </div>
);

Header.propTypes = {
  translate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(Header);
