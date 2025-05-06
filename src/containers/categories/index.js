import React from 'react';

import CategoryList from './CategoryList';
import New from '../common/New';
import Snackbar from '../common/Snackbar';
import { addCategory } from '../../actions/categories';

const Categories = (props) => (
  <div>
    <New view="categories" onAdd={addCategory} />
    <Snackbar />
    <CategoryList view="categories" {...props} />
  </div>
);

export default Categories;
