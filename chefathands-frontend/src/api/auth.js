import axios from "axios";

// Spremenite to vrstico:
const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const login = (username, password) =>
    axios.post(`${BASE}/api/login`, { username, password });

export const signup = (username, email, password) =>
    axios.post(`${BASE}/api/register`, { username, email, password });