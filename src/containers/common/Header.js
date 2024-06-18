import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import onelisticon from '../../assets/icons/onelist.svg';
import settingicon from '../../assets/icons/settings.svg';

const Header = ({ translate }) => (
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
            {translate('nav.shoppinglist')}
          </NavLink>
        </li>
        <li>
          <NavLink to="/categories">{translate('nav.categories')}</NavLink>
        </li>
        <li>
          <NavLink to="/products">{translate('nav.products')}</NavLink>
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
