import React from 'react';

import CategoryList from './CategoryList';
import New from '../common/New';
import Snackbar from '../common/Snackbar';
import { addCategory } from '../../actions/categories';

const Categories = () => (
  <div>
    <New view="categories" onAdd={addCategory} />
    <Snackbar />
    <CategoryList view="categories" />
  </div>
);

export default Categories;
