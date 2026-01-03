import axios from "axios";

const BASE = "http://localhost:8080/api/users";
const ING_BASE = "http://localhost:8080/api/ingredients";

export const getUserIngredients = (userId) =>
    axios.get(`${BASE}/${userId}/ingredients`);

export const addUserIngredient = (userId, ingredient) =>
    axios.post(`${BASE}/${userId}/ingredients`, ingredient);

export const deleteUserIngredient = (userId, userIngredientId) =>
    axios.delete(`${BASE}/${userId}/ingredients/${userIngredientId}`);

export const searchIngredients = (name) =>
    axios.get(`${ING_BASE}/search?name=${encodeURIComponent(name)}`);

export const createIngredient = (ingredient) =>
    axios.post(ING_BASE, ingredient);

export const getIngredientById = (id) =>
    axios.get(`${ING_BASE}/${id}`);