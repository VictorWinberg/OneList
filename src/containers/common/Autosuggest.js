import { connect } from 'react-redux';

import Autosuggest from '../../components/Autosuggest';

const sections = [
  {
    category: 'Dairy',
    products: ['Butter', 'Cheese', 'Yoghurt', 'Milk'],
  },
  {
    category: 'Pasta',
    products: ['Penne', 'Spaghetti', 'Macaroni', 'Tortellini', 'Tagliatelle'],
  },
  {
    category: 'Fruit and Vegetables',
    products: ['Apple', 'Avocado', 'Pear', 'Banana', 'Carrot', 'Pineapple'],
  },
];

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();

  return sections
    .map(({ category, products }) => ({
      category,
      products: products.filter(product =>
        product.toLowerCase().includes(inputValue)
      ),
    }))
    .filter(item => item.products.length);
};

const mapStateToProps = () => ({
  getSuggestions,
});

export default connect(mapStateToProps)(Autosuggest);
