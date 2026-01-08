import axios from "axios";

// Spremenite na relativno pot
const BASE = window.location.origin;

export const getUserIngredients = (userId) =>
    axios.get(`${BASE}/api/users/${userId}/ingredients`);

export const addUserIngredient = (userId, ingredient) =>
    axios.post(`${BASE}/api/users/${userId}/ingredients`, ingredient);

export const deleteUserIngredient = (userId, userIngredientId) =>
    axios.delete(`${BASE}/api/users/${userId}/ingredients/${userIngredientId}`);

export const searchIngredients = (name) =>
    axios.get(`${BASE}/api/ingredients/search?name=${encodeURIComponent(name)}`);

export const createIngredient = (ingredient) =>
    axios.post(`${BASE}/api/ingredients`, ingredient);

export const getIngredientById = (id) =>
    axios.get(`${BASE}/api/ingredients/${id}`);