import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { setActiveStore } from '../../actions/stores';

const StorePicker = ({
  stores,
  activeStoreId,
  onChange,
  t,
  labelKey,
  className,
}) => {
  if (!stores.length) {
    return (
      <p className={className}>{t('stores.none')}</p>
    );
  }

  return (
    <div className={`store-picker ${className || ''}`.trim()}>
      <label htmlFor="store-select">{t(labelKey)}</label>
      <select
        id="store-select"
        value={activeStoreId || ''}
        onChange={({ target }) => onChange(parseInt(target.value, 10))}
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

StorePicker.propTypes = {
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeStoreId: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  labelKey: PropTypes.string,
  className: PropTypes.string,
};

StorePicker.defaultProps = {
  activeStoreId: null,
  labelKey: 'stores.label',
  className: '',
};

const mapStateToProps = (state) => ({
  stores: state.stores.list,
  activeStoreId: state.stores.activeStoreId,
});

const mapDispatchToProps = {
  onChange: setActiveStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(StorePicker));
