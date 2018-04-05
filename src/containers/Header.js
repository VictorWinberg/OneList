import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

const Header = ({ translate }) => (
  <div className="header">
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
          <NavLink exact to="/">{translate('nav.shoppinglist')}</NavLink>
        </li>
        <li>
          <NavLink to="/categories">{translate('nav.categories')}</NavLink>
        </li>
        <li>
          <NavLink to="/share">{translate('nav.share')}</NavLink>
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
