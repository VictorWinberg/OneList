import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { find, get, toInteger } from 'lodash/fp';

import { addCategory } from '../../actions/categories';
import { editProduct, removeProduct } from '../../actions/products';
import CategorySelect from './CategorySelect';

const EditProduct = ({ id, name, translate, onRemove, onSubmit, history }) => (
  <div className="product">
    <div className="title">
      <b>{translate('edit.edit')}: </b>
      {name}
    </div>
    <div className="wrapper">
      <form onSubmit={evt => onSubmit(evt, id, history)}>
        <label htmlFor="productName">
          <span>{translate('edit.name')}:</span>
          <input
            id="productName"
            name="productName"
            autoComplete="off"
            defaultValue={name}
          />
        </label>
        <label htmlFor="productName">
          <span>{translate('edit.amount')}:</span>
          <div>
            <input
              id="productAmountText"
              className="productAmountText"
              name="productName"
              autoComplete="off"
              defaultValue="100"
            />
            <input
              id="productAmountUnit"
              className="productAmountUnit"
              name="productName"
              autoComplete="off"
              defaultValue="gram"
            />
          </div>
        </label>
        <CategorySelect id={id} />
        <button
          className="deleteBtn"
          type="button"
          onClick={() => {
            onRemove(id);
            history.push('/');
          }}
        >
          {translate('edit.delete')}
        </button>
        <button
          className="cancelBtn"
          type="button"
          onClick={() => history.push('/')}
        >
          {translate('edit.cancel')}
        </button>
        <button className="doneBtn" type="submit">
          {translate('edit.save')}
        </button>
      </form>
    </div>
  </div>
);

EditProduct.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const handleSubmit = (event, id, history) => dispatch => {
  const data = new FormData(event.target);
  const [name, category, newCategory] = [
    'productName',
    'category',
    'newCategory',
  ].map(type => data.get(type));

  const edit = editProduct({ id, name, category: toInteger(category) });

  if (newCategory) {
    dispatch(addCategory({ name: newCategory }, () => dispatch(edit)));
  } else {
    dispatch(edit);
  }

  event.preventDefault();
  history.push('/');
};

const mapStateToProps = (state, { match }) => {
  const id = toInteger(match.params.id);

  return {
    id,
    name: get('name', find({ id }, state.products)),
    translate: getTranslate(state.locale),
  };
};

const mapDispatchToProps = {
  onSubmit: handleSubmit,
  onRemove: removeProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProduct);
