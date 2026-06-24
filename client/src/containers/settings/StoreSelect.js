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
    onSelectStore(parseInt(target.value, 10));
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
    const { stores, activeStoreId, t } = this.props;
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
            value={activeStoreId || ''}
            onChange={this.handleSelectChange}
          >
            {stores.map(({ id, name }) => (
              <option key={id} value={id}>
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
  activeStoreId: PropTypes.number,
  onSelectStore: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

StoreSelect.defaultProps = {
  activeStoreId: null,
};

const mapStateToProps = (state) => ({
  stores: state.stores.list,
  activeStoreId: state.stores.activeStoreId,
});

const mapDispatchToProps = {
  onSelectStore: setActiveStore,
  onAdd: addStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(StoreSelect));
