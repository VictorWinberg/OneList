import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';

/*
import ProductList from './ProductList';
import New from '../common/New';
import { addProduct } from '../../actions/products';
const EditProduct = ({ name, category, categories }) => (
*/

const EditProduct = ({ name, category, categories }) => (
  <div className="product">
    <div className="title">{name}</div>
    <div className="wrapper">
      <form>
        <label htmlFor="productName">
          <span>Produktnamn:</span>
          <input id="productName" defaultValue={name} />
        </label>
        <label htmlFor="categories">
          <span>Kategori:</span>
          <select id="categories" selected={category}>
            <option selected>{category}</option>
            <option>Mejeri</option>
            <option>Grönsaker</option>
          </select>
        </label>
        <button className="doneBtn" type="submit">
          Klar
        </button>
        <button className="cancelBtn" type="submit" action="/">
          Avbryt
        </button>
      </form>
    </div>
  </div>
);

EditProduct.defaultProps = {
  category: 'Uncategorized',
};

EditProduct.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const getProduct = (products, id) => {
  const found = products.filter(product => product.id === id);
  if (found.length > 0) {
    return found[0];
  }
  return {};
};

const mapStateToProps = (state, ownProps) => {
  const product = getProduct(
    state.products,
    parseInt(ownProps.match.params.id, 10)
  );

  return {
    name: product.text,
    category: product.category,
    categories: state.categories.map(category => category.text),
  };
};

export default connect(mapStateToProps)(EditProduct);
