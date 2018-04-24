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
  <div>
    <div className="title">{name}</div>
    <div className="productWrapper">
    <form>
      <label className="productLabel" htmlFor="productName">Produktnamn:</label>
      <input className="productInput" defaultValue={name}/>
      <label className="productLabel" htmlFor="categories">Kategori:</label>
      <select className="categorySelector" id="categories" selected={category}>
        <option selected>
          {category}
        </option>
        <option> Mejeri</option>
        <option> Grönsaker</option>
      </select>
      <div className="editOptions">
        <button className="doneProduct" type="submit"> Klar </button>
        <button className="cancelProduct" type="submit" action="/"> Avbryt </button>
      </div>
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
