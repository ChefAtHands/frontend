import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById } from "../api/recipes";

export default function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getRecipeById(id);
        if (mounted) setRecipe(res.data || null);
      } catch (err) {
        console.error('Failed to load recipe', err);
        if (mounted) setRecipe(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="container">Loading...</div>;

  if (!recipe) return (
    <div className="container">
      <div className="card center">
        <p>Recipe not found.</p>
        <button className="btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );

  const title = recipe.title || recipe.name || 'Untitled';
  const image = recipe.image || recipe.imageUrl || null;
  const ingredients = recipe.extendedIngredients || recipe.usedIngredients || recipe.ingredients || [];

  // Normalize instructions from several Spoonacular shapes
  let instructionSteps = [];
  if (typeof recipe.instructions === 'string' && recipe.instructions.trim()) {
    // instructions sometimes come as a single HTML/string
    instructionSteps = [recipe.instructions];
  } else if (Array.isArray(recipe.analyzedInstructions) && recipe.analyzedInstructions.length > 0) {
    // analyzedInstructions -> [{ name: "", steps: [{number, step}, ...] }, ...]
    recipe.analyzedInstructions.forEach((block) => {
      if (Array.isArray(block.steps)) {
        block.steps.forEach((s) => {
          if (s && (s.step || s.original)) instructionSteps.push(s.step || s.original);
        });
      }
    });
  } else if (Array.isArray(recipe.steps) && recipe.steps.length > 0) {
    // sometimes steps is an array of strings or objects
    recipe.steps.forEach((s) => {
      if (typeof s === 'string') instructionSteps.push(s);
      else if (s && (s.step || s.description)) instructionSteps.push(s.step || s.description);
      else instructionSteps.push(JSON.stringify(s));
    });
  } else if (Array.isArray(recipe.instructions) && recipe.instructions.length > 0) {
    instructionSteps = recipe.instructions;
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h1 style={{margin:0}}>{title}</h1>
          <button className="btn" onClick={() => navigate(-1)}>Back</button>
        </div>

        {image && <img src={image} alt={title} style={{ maxWidth: '100%', height: 'auto', borderRadius:8, marginTop:12 }} />}

        <h3 style={{marginTop:14}}>Ingredients</h3>
        <ul>
          {Array.isArray(ingredients) && ingredients.length > 0 ? (
            ingredients.map((ing, idx) => (
              <li key={idx}>{ing.original || ing.name || ing.title || JSON.stringify(ing)}</li>
            ))
          ) : (
            <li>No ingredient details</li>
          )}
        </ul>

        <h3>Instructions</h3>
        {instructionSteps && instructionSteps.length > 0 ? (
          <ol>
            {instructionSteps.map((inst, i) => (
              <li key={i}>{inst}</li>
            ))}
          </ol>
        ) : (
          <p>No instructions available.</p>
        )}
      </div>
    </div>
  );
}
