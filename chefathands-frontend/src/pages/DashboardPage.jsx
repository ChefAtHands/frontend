import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserIngredients, addUserIngredient, deleteUserIngredient, searchIngredients, createIngredient, getIngredientById } from "../api/ingredients";
import { getRecommendations, getRecipeById } from "../api/recipes";
import { Link } from "react-router-dom";

export default function DashboardPage() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const RECIPE_CACHE_KEY = `recipes_cache_user_${userId}`;

    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [input, setInput] = useState("");

    //if not logged in
    useEffect(() => {
        if (!userId) navigate("/login");   
    }, [userId, navigate]);

    // load ingredients
    useEffect(() => {
        loadIngredients();
    }, []);

    useEffect(() => {
        const cached = localStorage.getItem(RECIPE_CACHE_KEY);
        if (cached) {
            try {
                setRecipes(JSON.parse(cached));
            } catch {
                localStorage.removeItem(RECIPE_CACHE_KEY);
            }
        }
    }, [RECIPE_CACHE_KEY]);

    // Do not auto-search when ingredients change — recipes load only on user action

    const loadIngredients = async () => {
        try {
            const res = await getUserIngredients(userId);
            const items = Array.isArray(res.data) ? res.data : [];
            const enriched = await Promise.all(items.map(async (ui) => {
                try {
                    const ingRes = await getIngredientById(ui.ingredientId);
                    return { ...ui, name: ingRes.data.name };
                } catch (e) {
                    return { ...ui, name: ui.name || '' };
                }
            }));

            setIngredients(enriched);

        } catch (err) {
            console.error('Failed to load ingredients', err);
            setIngredients([]);
        }
    };

    const loadRecipes = async () => {
        try {
            const res = await getRecommendations(userId);
            //console.debug('getRecommendations response:', res?.data);
            const list = (res.data && (res.data.recipes || res.data.recpies || res.data)) || [];

            // If recipes have only ids or incomplete fields, fetch details
            // Limit how many recipe detail lookups we do per load to avoid many calls
            const MAX_DETAIL_FETCH = 6;
            let detailFetches = 0;
            const enriched = await Promise.all(list.map(async (r) => {
                if (r.title && r.title.trim()) return r;
                if (detailFetches >= MAX_DETAIL_FETCH) return r;
                try {
                    const detail = await getRecipeById(r.id);
                    detailFetches += 1;
                    return { ...r, title: detail.data?.title || detail.data?.name || '' , image: detail.data?.image || '' };
                } catch (e) {
                    return r;
                }
            }));

            setRecipes(enriched || []);

            localStorage.setItem(
                RECIPE_CACHE_KEY,
                JSON.stringify(enriched || [])
            );

        } catch (err) {
            console.error('Failed to load recipes', err);
            setRecipes([]);
        }
    };

    const addIngredient = async () => {
        if(!input.trim()) return;

        try {
            // Try to find existing ingredient by name
            const searchRes = await searchIngredients(input);
            let ingredientId = null;
            if (Array.isArray(searchRes.data) && searchRes.data.length > 0) {
                ingredientId = searchRes.data[0].id;
            } else {
                // Create ingredient if not found
                const createRes = await createIngredient({ name: input, category: "Other" });
                ingredientId = createRes.data.id;
            }

            await addUserIngredient(userId, {
                ingredientId,
                quantity: "1"
            });
            localStorage.removeItem(RECIPE_CACHE_KEY);
            setRecipes([]);

            setInput("");
            loadIngredients();
        } catch (err) {
            console.error(err);
            alert("Failed to add ingredient. See console for details.");
        }
    };

    const removeIngredient = async (id) => {
        await deleteUserIngredient(userId, id);
        localStorage.removeItem(RECIPE_CACHE_KEY);
        setRecipes([]);
        loadIngredients();
    };

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="container">
            <div className="card row" style={{justifyContent:'space-between', alignItems:'center'}}>
                <div>
                    <h2 style={{margin:0}}>Welcome, {username}</h2>
                </div>
                <div>
                    <button className="btn secondary" onClick={logout}>Logout</button>
                </div>
            </div>

            <div className="card">
                <h3>Your Ingredients</h3>
                <div className="row" style={{marginBottom:12, gap: 10}}>
                    <input
                        placeholder="Add ingredient..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button className="btn" onClick={addIngredient}>Add</button>
                </div>

                <ul className="ingredients-list">
                    {ingredients.map((ing) => (
                        <li key={ing.id}>
                            <span>{ing.name} (qty: {ing.quantity})</span>
                            <button className="btn secondary" style={{marginLeft:8}} onClick={() => removeIngredient(ing.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="card">
                <h3>Recommended Recipes</h3>
                {recipes.length === 0 ? (
                    <div className="center">No recommendations yet. Try adding ingredients or press Refresh.</div>
                ) : (
                    <ul className="recipes-list">
                        {recipes.map((r) => (
                            <li key={r.id}>
                                <Link to={`/recipe/${r.id}`} style={{ textDecoration: 'none', color: 'inherit', display:'flex', alignItems:'center' }}>
                                    {r.image && <img className="recipe-thumb" src={r.image} alt={r.title || r.name} />}
                                    <div>{r.title || r.name || `Recipe ${r.id}`}</div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                <div style={{marginTop:10, textAlign:'right'}}>
                    <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
                        <button className="btn btn-primary" onClick={loadRecipes}>Search</button>
                        <button className="btn btn-outline" onClick={loadRecipes}>Refresh</button>
                    </div>
                </div>
            </div>
        </div>
    );
}