import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import shoppingBagIcon from '../../assets/icons/shopping-bag.svg';
import { setActiveStore } from '../../actions/stores';

const HeaderStoreSelect = ({
  stores,
  store,
  onSelectStore,
  t,
}) => {
  if (!stores.length) {
    return null;
  }

  const initial = store?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="header-store-select">
      <span className="header-store-display" aria-hidden="true">
        <img
          className="header-store-icon"
          src={shoppingBagIcon}
          alt=""
          height="28"
        />
        <span className="header-store-initial">{initial}</span>
      </span>
      <select
        value={store || ''}
        aria-label={t('stores.label')}
        onChange={({ target }) => onSelectStore(target.value)}
      >
        {stores.map(({ id, name }) => (
          <option key={id} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

HeaderStoreSelect.propTypes = {
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  store: PropTypes.string,
  onSelectStore: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

HeaderStoreSelect.defaultProps = {
  store: null,
};

const mapStateToProps = (state) => ({
  stores: state.stores.list,
  store: state.user.store,
});

const mapDispatchToProps = {
  onSelectStore: setActiveStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(HeaderStoreSelect));
