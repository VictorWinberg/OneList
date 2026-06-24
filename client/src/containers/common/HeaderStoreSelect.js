import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import shoppingBagIcon from '../../assets/icons/shopping-bag.svg';
import { setActiveStore } from '../../actions/stores';

const HeaderStoreSelect = ({
  stores,
  activeStoreId,
  onSelectStore,
  t,
}) => {
  if (!stores.length) {
    return null;
  }

  const activeStore = stores.find(({ id }) => id === activeStoreId);
  const initial = activeStore?.name?.charAt(0).toUpperCase() ?? '?';

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
        value={activeStoreId || ''}
        aria-label={t('stores.label')}
        onChange={({ target }) =>
          onSelectStore(parseInt(target.value, 10))
        }
      >
        {stores.map(({ id, name }) => (
          <option key={id} value={id}>
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
  activeStoreId: PropTypes.number,
  onSelectStore: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

HeaderStoreSelect.defaultProps = {
  activeStoreId: null,
};

const mapStateToProps = (state) => ({
  stores: state.stores.list,
  activeStoreId: state.stores.activeStoreId,
});

const mapDispatchToProps = {
  onSelectStore: setActiveStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(HeaderStoreSelect));
