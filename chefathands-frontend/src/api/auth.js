import axios from "axios";

// Spremenite na relativno pot (brez localhost)
const BASE = window.location.origin;

export const login = (username, password) =>
    axios.post(`${BASE}/api/login`, { username, password });

export const signup = (username, email, password) =>
    axios.post(`${BASE}/api/register`, { username, email, password });