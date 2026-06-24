import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import CategoryList from './CategoryList';
import New from '../common/New';
import Snackbar from '../common/Snackbar';
import StorePicker from '../common/StorePicker';
import { addCategory } from '../../actions/categories';

const Categories = ({ activeStoreName, t }) => (
  <div>
    <StorePicker labelKey="stores.orderFor" />
    {activeStoreName && (
      <p className="store-order-context">
        {t('stores.orderingFor', { store: activeStoreName })}
      </p>
    )}
    <New view="categories" onAdd={addCategory} />
    <Snackbar />
    <CategoryList view="categories" />
  </div>
);

Categories.propTypes = {
  activeStoreName: PropTypes.string,
  t: PropTypes.func.isRequired,
};

Categories.defaultProps = {
  activeStoreName: null,
};

const mapStateToProps = (state) => {
  const { list, activeStoreId } = state.stores;
  const activeStore = list.find(({ id }) => id === activeStoreId);
  return { activeStoreName: activeStore?.name ?? null };
};

export default connect(mapStateToProps)(withTranslation()(Categories));
