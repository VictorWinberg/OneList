import React from 'react';

import CategoryList from './CategoryList';
import New from '../common/New';
import { addCategory } from '../../actions/categories';

const Categories = () => (
  <div>
    <New view="categories" onAdd={addCategory} />
    <CategoryList view="categories" />
  </div>
);

export default Categories;
