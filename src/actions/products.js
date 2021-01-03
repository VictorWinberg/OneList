import { FETCH_PRODUCTS } from "../constants/products";

export const addProduct = ({ name, category }) => async (dispatch) => {
  if (name) {
    try {
      await fetch("/__/products", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, category }),
      });
      return await dispatch(fetchProducts());
    } catch (err) {
      console.error(err);
    }
  }
};

export const editProduct = ({ id, name, amount, unit, category }) => async (dispatch) => {
  try {
    await fetch(`/__/products/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, amount, unit, category: category || null }),
    });
    return await dispatch(fetchProducts());
  } catch (err) {
    console.error(err);
  }
};

export const toggleProductChecked = (id) => async (dispatch) => {
  try {
    await fetch(`/__/products/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Type: "toggle-checked",
      },
      credentials: "include",
    });
    return await dispatch(fetchProducts());
  } catch (err) {
    console.error(err);
  }
};

export const toggleProductInactive = (id) => async (dispatch) => {
  try {
    await fetch(`/__/products/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Type: "toggle-inactive",
      },
      credentials: "include",
    });
    return await dispatch(fetchProducts());
  } catch (err) {
    console.error(err);
  }
};

export const removeProduct = (id) => async (dispatch) => {
  try {
    await fetch(`/__/products/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return await dispatch(fetchProducts());
  } catch (err) {
    console.error(err);
  }
};

export const inactivateProducts = () => async (dispatch) => {
  try {
    await fetch("/__/products", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return await dispatch(fetchProducts());
  } catch (err) {
    console.error(err);
  }
};

export const fetchProducts = () => (dispatch) =>
  fetch("/__/products", { credentials: "include" })
    .then((response) => response.json())
    .then((products) => dispatch({ type: FETCH_PRODUCTS, products }))
    .catch((err) => console.error(err));
