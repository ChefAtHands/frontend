import axios from "axios";

// Dodajte na vrh:
const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Spremenite vse URL-je:
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