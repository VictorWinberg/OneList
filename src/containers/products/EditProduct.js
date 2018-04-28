import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import CategorySelect from './CategorySelect';

const EditProduct = ({ id, name, translate }) => (
  <div className="product">
    <div className="title">
      <b>{translate('edit.edit')}: </b>
      {name}
    </div>
    <div className="wrapper">
      <form>
        <label htmlFor="productName">
          <span>{translate('edit.name')}:</span>
          <input id="productName" autoComplete="off" defaultValue={name} />
        </label>
        <label htmlFor="categories">
          <span>{translate('edit.category')}:</span>
          <CategorySelect id={id} />
        </label>
        <button className="cancelBtn" type="submit" action="/">
          Avbryt
        </button>
        <button className="doneBtn" type="submit">
          Klar
        </button>
      </form>
    </div>
  </div>
);

EditProduct.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
};

const getProduct = (products, id) => {
  const found = products.filter(product => product.id === id);
  return found.length > 0 ? found[0] : {};
};

const mapStateToProps = (state, ownProps) => {
  const id = parseInt(ownProps.match.params.id, 10);

  return {
    id,
    name: getProduct(state.products, id).text,
    translate: getTranslate(state.locale),
  };
};

export default connect(mapStateToProps)(EditProduct);
