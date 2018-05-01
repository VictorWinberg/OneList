import React from 'react';

import CategoryList from './CategoryList';
import Reorder from './Reorder';
import New from '../common/New';
import { addCategory } from '../../actions/categories';

const Categories = () => (
  <div>
    <New view="categories" onAdd={addCategory} />
    <CategoryList view="categories" />
    <Reorder />
  </div>
);

export default Categories;
