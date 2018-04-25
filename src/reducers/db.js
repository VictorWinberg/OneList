const initialState = {
  products: {
    '1': { id: 1, name: 'Butter', category: 1 },
    '2': { id: 2, name: 'Cheese', category: 1 },
    '3': { id: 3, name: 'Yoghurt', category: 1 },
    '4': { id: 4, name: 'Milk', category: 1 },
    '5': { id: 5, name: 'Penne', category: 2 },
    '6': { id: 6, name: 'Spaghetti', category: 2 },
    '7': { id: 7, name: 'Macaroni', category: 2 },
    '8': { id: 8, name: 'Tortellini', category: 2 },
    '9': { id: 9, name: 'Tagliatelle', category: 2 },
    '10': { id: 10, name: 'Apple', category: 3 },
    '11': { id: 11, name: 'Avocado', category: 3 },
    '12': { id: 12, name: 'Pear', category: 3 },
    '13': { id: 13, name: 'Banana', category: 3 },
    '14': { id: 14, name: 'Carrot', category: 3 },
    '15': { id: 15, name: 'Pineapple', category: 3 },
  },
  categories: {
    '1': { id: 1, name: 'Dairy' },
    '2': { id: 2, name: 'Pasta' },
    '3': { id: 3, name: 'Fruit' },
  },
};

const db = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default db;
