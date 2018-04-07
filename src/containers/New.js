import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addProduct } from '../actions/products';

class New extends Component {
  constructor(props) {
    super(props);

    this.state = { product: '' };
  }

  handleSubmit(event) {
    const { product } = this.state;
    const { onNewProductClick } = this.props;

    onNewProductClick(product);
    this.setState({ product: '' });
    event.preventDefault();
  }

  render() {
    const { product } = this.state;

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
            value={product}
            autoComplete="off"
            placeholder="New product..."
            onChange={event => this.setState({ product: event.target.value })}
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
  onNewProductClick: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  onNewProductClick: addProduct,
};

export default connect(null, mapDispatchToProps)(New);
