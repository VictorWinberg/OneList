import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import addicon from '../../assets/icons/add.svg';
import clearicon from '../../assets/icons/clear.svg';

import Autosuggest from './Autosuggest';

class New extends Component {
  constructor(props) {
    super(props);

    this.state = { item: '' };
  }

  onSelect({ target }, { suggestion }) {
    const { onAddItem, onRemoveItem } = this.props;

    if (target.name === 'delete') {
      onRemoveItem(suggestion);
    } else {
      onAddItem(suggestion);
      this.setState({ item: '' });
    }
  }

  handleSubmit(event) {
    const { item } = this.state;
    const { onAddItem } = this.props;

    onAddItem(item);
    this.setState({ item: '' });
    event.preventDefault();
  }

  render() {
    const { item } = this.state;
    const { translate, view, autosuggest } = this.props;

    const inputfield = autosuggest ? (
      <Autosuggest
        id="newItem"
        value={item}
        placeholder={translate(`${view}.input`)}
        onSelect={(evt, values) => this.onSelect(evt, values)}
        onChange={({ target }, { method }) => {
          if (method === 'type') this.setState({ item: target.value });
        }}
      />
    ) : (
      <input
        id="newItem"
        type="text"
        value={item}
        autoComplete="off"
        placeholder={translate(`${view}.input`)}
        onChange={({ target }) => this.setState({ item: target.value })}
      />
    );

    return (
      <form className="search-form" onSubmit={evt => this.handleSubmit(evt)}>
        <span role="presentation" onClick={() => this.setState({ item: '' })}>
          <img className="clear-icon" alt="X" src={clearicon} height="12px" />
        </span>
        <label htmlFor="newItem">
          <img className="add-icon" alt="add" src={addicon} height="12px" />
          {inputfield}
        </label>
      </form>
    );
  }
}

New.defaultProps = {
  autosuggest: false,
};

New.propTypes = {
  autosuggest: PropTypes.bool,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch, { onAdd, onRemove }) => ({
  onAddItem: item => onAdd && dispatch(onAdd(item)),
  onRemoveItem: item => onRemove && dispatch(onRemove(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(New);
