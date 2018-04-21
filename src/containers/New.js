import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

class New extends Component {
  constructor(props) {
    super(props);

    this.state = { item: '' };
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
    const { translate, view } = this.props;

    return (
      <div className="search">
        <form className="newForm" onSubmit={event => this.handleSubmit(event)}>
          <label htmlFor="newItem">
            <img
              className="add_icon"
              alt="add"
              src="/icons/add_icon.png"
              height="12px"
            />
          </label>
          <input
            id="newItem"
            type="text"
            value={item}
            autoComplete="off"
            placeholder={translate(`${view}.input`)}
            onChange={event => this.setState({ item: event.target.value })}
          />
          <img
            className="clear_icon"
            alt="X"
            src="/icons/clear_icon.png"
            height="12px"
          />
        </form>
      </div>
    );
  }
}

New.propTypes = {
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
