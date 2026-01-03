import axios from "axios";

const BASE = "http://localhost:8080/api/recommendations";
const RECIPE_BASE = "http://localhost:8085/api/recipes";

export const getRecommendations = (userId) =>
    axios.get(`${BASE}?userId=${userId}`);

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

    const res = await axios.get(`${RECIPE_BASE}/${id}`);
    try {
        cache[id] = { data: res.data, cachedAt: Date.now() };
        saveCache(cache);
    } catch (e) {
        // ignore cache write errors
    }
    return res;
};