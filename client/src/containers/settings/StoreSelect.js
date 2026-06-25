import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { addStore, setActiveStore } from '../../actions/stores';

class StoreSelect extends Component {
  constructor(props) {
    super(props);
    this.state = { creating: false, newName: '' };
  }

  componentDidUpdate(prevProps) {
    const { creating } = this.state;
    const { stores } = this.props;
    if (creating && stores.length > prevProps.stores.length) {
      this.setState({ creating: false, newName: '' });
    }
  }

  handleSelectChange = ({ target }) => {
    const { onSelectStore } = this.props;
    const lastIndex = target.options.length - 1;
    if (target.selectedIndex === lastIndex) {
      this.setState({ creating: true, newName: '' });
      return;
    }

    this.setState({ creating: false, newName: '' });
    onSelectStore(target.value);
  };

  handleCreate = () => {
    const { newName } = this.state;
    const { onAdd } = this.props;
    const trimmed = newName.trim();
    if (trimmed) {
      onAdd({ name: trimmed });
      return;
    }

    this.setState({ creating: false, newName: '' });
  };

  render() {
    const { stores, store, t } = this.props;
    const { creating, newName } = this.state;
    const showCreate = creating || !stores.length;

    return (
      <label htmlFor="store-select">
        <span>{t('stores.label')}</span>
        {showCreate ? (
          <input
            id="store-select"
            type="text"
            autoComplete="off"
            // eslint-disable-next-line
            autoFocus
            value={newName}
            placeholder={t('stores.input')}
            onChange={({ target }) => this.setState({ newName: target.value })}
            onBlur={this.handleCreate}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                this.handleCreate();
              }
              if (event.key === 'Escape') {
                this.setState({ creating: false, newName: '' });
              }
            }}
          />
        ) : (
          <select
            id="store-select"
            value={store || ''}
            onChange={this.handleSelectChange}
          >
            {!store && (
              <option value="" disabled>
                {t('stores.selectPlaceholder')}
              </option>
            )}
            {stores.map(({ id, name }) => (
              <option key={id} value={name}>
                {name}
              </option>
            ))}
            <option>{t('stores.createNew')}</option>
          </select>
        )}
      </label>
    );
  }
}

StoreSelect.propTypes = {
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  store: PropTypes.string,
  onSelectStore: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

StoreSelect.defaultProps = {
  store: null,
};

const mapStateToProps = (state) => ({
  stores: state.stores.list,
  store: state.user.store,
});

const mapDispatchToProps = {
  onSelectStore: setActiveStore,
  onAdd: addStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(StoreSelect));
