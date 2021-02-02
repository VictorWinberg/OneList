import { FETCH_PRODUCTS } from "../constants/products";

export const addProduct = ({ name, uid }) => async (dispatch) => {
  if (name) {
    try {
      await fetch("/__/products", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, uid }),
      });
      return await dispatch(fetchProducts());
    } catch (err) {
      console.error(err);
    }
  }
};

export const editProduct = ({ id, name, amount, unit, category }) => async (
  dispatch
) => {
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

export const toggleProductChecked = ({ id, uid }) => async (dispatch) => {
  try {
    await fetch(`/__/products/${id}/${uid}`, {
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

export const toggleProductInactive = (item, getData) => async (dispatch) => {
  try {
    const { userId } = getData(item);
    await fetch(`/__/products/${item.id}/${userId}`, {
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

export const inactivateProducts = (_, getData) => async (dispatch) => {
  try {
    const { userId } = getData({});
    await fetch(`/__/inactivate/${userId}`, {
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

export const fetchProducts = () => async (dispatch) => {
  try {
    const res = await fetch("/__/products", { credentials: "include" });
    const products = await res.json();
    return dispatch({ type: FETCH_PRODUCTS, products });
  } catch (err) {
    console.error(err);
  }
};
