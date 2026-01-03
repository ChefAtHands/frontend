import axios from "axios";

const BASE = "http://localhost:8080/api";

export const login = (username, password) =>
    axios.post(`${BASE}/login`, { username, password });

export const signup = (username, email, password) =>
    axios.post(`${BASE}/register`, { username, email, password });