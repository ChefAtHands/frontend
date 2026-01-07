import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const getRecommendations = (userId, filters = {}) => {
    const cleaned = Object.fromEntries(
        Object.entries(filters).map(([k, v]) => [
            k,
            v === "" ? undefined : v
        ])
    );

    const params = {userId, ...cleaned};
    console.log("Sending request with params:", params);

    return axios.get(`${BASE}/api/recommendations`, { params });
};

export const searchRecipesWithIngredients = (userId, names, number = 10, offset = 0) => {
    const payload = { ingredients: (names || []).map(n => ({ name: n })) };
    return axios.post(`${BASE}/api/recommendations?userId=${userId}&number=${number}&offset=${offset}`, payload);
};

// Simple local cache to avoid repeated calls to the recipe-search service
const RECIPE_CACHE_KEY = "chef_recipe_cache_v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function loadCache() {
    try {
        const raw = localStorage.getItem(RECIPE_CACHE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function saveCache(cache) {
    try {
        localStorage.setItem(RECIPE_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        // ignore
    }
}

export function clearRecipeCache() {
    try { localStorage.removeItem(RECIPE_CACHE_KEY); } catch (e) {}
}

export const getRecipeById = async (id) => {
    if (!id) return Promise.resolve({ data: null });
    const cache = loadCache();
    const entry = cache[id];
    const now = Date.now();
    if (entry && (now - entry.cachedAt) < CACHE_TTL_MS) {
        return Promise.resolve({ data: entry.data });
    }

    const res = await axios.get(`${BASE}/api/recipes/${id}`);
    try {
        cache[id] = { data: res.data, cachedAt: Date.now() };
        saveCache(cache);
    } catch (e) {
        // ignore cache write errors
    }
    return res;
};