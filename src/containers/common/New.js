import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import Autosuggest from './Autosuggest';

class New extends Component {
  constructor(props) {
    super(props);

    this.state = { item: '' };
  }

  onChange(event, { method, newValue }) {
    const { onAddItem } = this.props;

    switch (method) {
      case 'type':
        this.setState({ item: newValue });
        break;
      case 'click':
        onAddItem(newValue);
        this.setState({ item: '' });
        break;
      default:
        break;
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
        onChange={(event, value) => this.onChange(event, value)}
      />
    ) : (
      <input
        id="newItem"
        type="text"
        value={item}
        autoComplete="off"
        placeholder={translate(`${view}.input`)}
        onChange={event => this.setState({ item: event.target.value })}
      />
    );

    return (
      <div className="search">
        <form onSubmit={event => this.handleSubmit(event)}>
          <span role="presentation" onClick={() => this.setState({ item: '' })}>
            <img
              className="clear_icon"
              alt="X"
              src="/icons/clear_icon.png"
              height="12px"
            />
          </span>
          <label htmlFor="newItem">
            <img
              className="add_icon"
              alt="add"
              src="/icons/add_icon.png"
              height="12px"
            />
            {inputfield}
          </label>
        </form>
      </div>
    );
  }
}

New.defaultProps = {
  autosuggest: false,
};

New.propTypes = {
  autosuggest: PropTypes.bool,
  onAddItem: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddItem: item => dispatch(ownProps.onAdd(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(New);
