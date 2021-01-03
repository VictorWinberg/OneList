import { REORDER_CATEGORY, FETCH_CATEGORIES } from "../constants/categories";

export const addCategory = ({ name }, next) => async (dispatch) => {
  let json = {};
  if (name) {
    try {
      const res = await fetch("/__/categories", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      json = await res.json();
      if (next) await next(json);
      return await dispatch(fetchCategories());
    } catch (err) {
      console.error(err);
    }
  }
};

export const editCategory = ({ id, name, color }) => async (dispatch) => {
  try {
    await fetch(`/__/categories/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, color }),
    });
    return await dispatch(fetchCategories());
  } catch (err) {
    console.error(err);
  }
};

export const removeCategory = (id) => async (dispatch) => {
  try {
    await fetch(`/__/categories/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return await dispatch(fetchCategories());
  } catch (err) {
    console.error(err);
  }
};

export const reorderCategory = ({ startIndex, endIndex }) => async (
  dispatch
) => {
  dispatch({
    type: REORDER_CATEGORY,
    startIndex,
    endIndex,
  });

  try {
    await fetch("/__/categories_reorder", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ startIndex, endIndex }),
    });
    return await dispatch(fetchCategories());
  } catch (err) {
    console.error(err);
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    const res = await fetch("/__/categories", { credentials: "include" });
    const categories = await res.json();
    return dispatch({ type: FETCH_CATEGORIES, categories });
  } catch (err) {
    console.error(err);
  }
};
