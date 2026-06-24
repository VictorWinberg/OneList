import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { addStore, editStore, removeStore } from '../../actions/stores';

class Stores extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', editing: {} };
  }

  handleAdd = (event) => {
    event.preventDefault();
    const { name } = this.state;
    const { onAdd } = this.props;
    onAdd({ name });
    this.setState({ name: '' });
  };

  handleEdit = (id, name) => {
    const { onEdit } = this.props;
    onEdit({ id, name });
    this.setState(({ editing }) => ({
      editing: { ...editing, [id]: undefined },
    }));
  };

  render() {
    const { stores, onRemove, t } = this.props;
    const { name, editing } = this.state;

    return (
      <div className="stores-settings">
        <h3>{t('stores.title')}</h3>
        <p>{t('stores.description')}</p>
        <ul className="stores-list">
          {stores.map((store) => (
            <li key={store.id}>
              <input
                type="text"
                value={editing[store.id] ?? store.name}
                onChange={({ target }) =>
                  this.setState(({ editing: prev }) => ({
                    editing: { ...prev, [store.id]: target.value },
                  }))
                }
                onBlur={() => {
                  const nextName = editing[store.id];
                  if (nextName && nextName !== store.name) {
                    this.handleEdit(store.id, nextName);
                  }
                }}
              />
              <button
                type="button"
                className="deleteBtn"
                onClick={() => onRemove(store.id)}
                disabled={stores.length <= 1}
              >
                {t('edit.delete')}
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={this.handleAdd}>
          <input
            type="text"
            placeholder={t('stores.input')}
            value={name}
            onChange={({ target }) => this.setState({ name: target.value })}
          />
          <button type="submit">{t('stores.add')}</button>
        </form>
      </div>
    );
  }
}

Stores.propTypes = {
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  stores: state.stores.list,
});

const mapDispatchToProps = {
  onAdd: addStore,
  onEdit: editStore,
  onRemove: removeStore,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Stores));
