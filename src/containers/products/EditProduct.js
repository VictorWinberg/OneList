import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { get, find } from 'lodash/fp';
import { toInteger } from 'lodash/lang';

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

const mapStateToProps = (state, { match }) => {
  const id = toInteger(match.params.id);

  return {
    id,
    name: get('text', find({ id }, state.products)),
    translate: getTranslate(state.locale),
  };
};

export default connect(mapStateToProps)(EditProduct);
