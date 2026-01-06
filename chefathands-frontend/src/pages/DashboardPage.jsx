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
    const [filters, setFilters] = useState({
        minProtein: "",
        maxProtein: "",
        minCarbs: "",
        maxCarbs: "",
        minCalories: "",
        maxCalories: "",
        minFat: "",
        maxFat: "",
        type: "",
        diet: ""
    });

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

    useEffect(() => {
        localStorage.removeItem(RECIPE_CACHE_KEY);
    }, []);

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
            const res = await getRecommendations(userId, filters);
            //console.debug('getRecommendations response:', res?.data);
            const list = res.data?.recipes || [];

            // If recipes have only ids or incomplete fields, fetch details
            // Limit how many recipe detail lookups we do per load to avoid many calls
            setRecipes(list);

            //setRecipes(enriched);

            localStorage.setItem(
                RECIPE_CACHE_KEY,
                JSON.stringify(list)
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
        try {
        await deleteUserIngredient(userId, id);
        localStorage.removeItem(RECIPE_CACHE_KEY);
        setRecipes([]);
        await loadIngredients();
        } catch(err) {
            console.error("Failed to delete ingredient", err);
        }
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
            
            {/* ===== Filters Card ===== */}
            <div className="card">
            <h3 style={{ marginBottom: "16px" }}>Filters</h3>

            <div 
                className="row" 
                style={{ 
                flexWrap: "wrap", 
                gap: "14px",
                marginBottom: "12px"
                }}
            >
                {/* Protein */}
                <input 
                type="number" 
                placeholder="Min Protein" 
                value={filters.minProtein}
                onChange={(e) => setFilters({ ...filters, minProtein: e.target.value })}
                style={{ maxWidth: "160px" }}
                />
                <input 
                type="number" 
                placeholder="Max Protein" 
                value={filters.maxProtein}
                onChange={(e) => setFilters({ ...filters, maxProtein: e.target.value })}
                style={{ maxWidth: "160px" }}
                />

                {/* Carbs */}
                <input 
                type="number" 
                placeholder="Min Carbs" 
                value={filters.minCarbs}
                onChange={(e) => setFilters({ ...filters, minCarbs: e.target.value })}
                style={{ maxWidth: "160px" }}
                />
                <input 
                type="number" 
                placeholder="Max Carbs" 
                value={filters.maxCarbs}
                onChange={(e) => setFilters({ ...filters, maxCarbs: e.target.value })}
                style={{ maxWidth: "160px" }}
                />

                {/* Calories */}
                <input 
                type="number" 
                placeholder="Min Calories" 
                value={filters.minCalories}
                onChange={(e) => setFilters({ ...filters, minCalories: e.target.value })}
                style={{ maxWidth: "160px" }}
                />
                <input 
                type="number" 
                placeholder="Max Calories" 
                value={filters.maxCalories}
                onChange={(e) => setFilters({ ...filters, maxCalories: e.target.value })}
                style={{ maxWidth: "160px" }}
                />

                {/* Fat */}
                <input 
                type="number" 
                placeholder="Min Fat" 
                value={filters.minFat}
                onChange={(e) => setFilters({ ...filters, minFat: e.target.value })}
                style={{ maxWidth: "160px" }}
                />
                <input 
                type="number" 
                placeholder="Max Fat" 
                value={filters.maxFat}
                onChange={(e) => setFilters({ ...filters, maxFat: e.target.value })}
                style={{ maxWidth: "160px" }}
                />

                {/* Type */}
                <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                style={{ maxWidth: "200px" }}
                >
                <option value="">Any Type</option>
                <option value="main course">Main Course</option>
                <option value="side dish">Side Dish</option>
                <option value="dessert">Dessert</option>
                <option value="appetizer">Appetizer</option>
                <option value="salad">Salad</option>
                <option value="breakfast">Breakfast</option>
                <option value="soup">Soup</option>
                </select>

                {/* Diet */}
                <select
                value={filters.diet}
                onChange={(e) => setFilters({ ...filters, diet: e.target.value })}
                style={{ maxWidth: "200px" }}
                >
                <option value="">Any Diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten free">Gluten Free</option>
                <option value="dairy free">Dairy Free</option>
                <option value="ketogenic">Ketogenic</option>
                <option value="paleo">Paleo</option>
                </select>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button 
                className="btn secondary"
                onClick={() => {
                    setFilters({
                    minProtein: "",
                    maxProtein: "",
                    minCarbs: "",
                    maxCarbs: "",
                    minCalories: "",
                    maxCalories: "",
                    minFat: "",
                    maxFat: "",
                    type: "",
                    diet: ""
                    });
                }}
                >
                Clear
                </button>

                <button 
                className="btn"
                onClick={loadRecipes}
                >
                Apply Filters
                </button>
            </div>
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