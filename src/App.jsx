import { useEffect, useState } from "react";
import './App.css';
import { Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dietFilter, setDietFilter] = useState("all");
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchRecipes = async () => {
  //     try {
  //       const res = await fetch(
  //         `https://api.spoonacular.com/recipes/random?number=20&apiKey=${API_KEY}`
  //       );
  //       const data = await res.json();
  //       setRecipes(data.recipes); // 'recipes' is the array inside the response
  //     } catch (err) {
  //       console.error("Error fetching recipes:", err);
  //     }
  //   };

  //   fetchRecipes();
  // }, []);

  useEffect(() => {
  const fetchRecipes = async () => {
    

    try {
      if (!searchQuery.trim() && dietFilter === "all") {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/random?number=5&apiKey=${API_KEY}`
        );
        const data = await res.json();
        setRecipes(data.recipes);
      }
      else {
      const url = `https://api.spoonacular.com/recipes/complexSearch?query=${searchQuery}&number=10${dietFilter !== "all" ? `&diet=${dietFilter}` : ""}&apiKey=${API_KEY}`;
  
      const res = await fetch(url);
      const data = await res.json();

      const detailed = await Promise.all(
        data.results.map((r) =>
          fetch(
            `https://api.spoonacular.com/recipes/${r.id}/information?apiKey=${API_KEY}`
          ).then((res) => res.json())
        )
      );

      setRecipes(detailed);
    }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const delay = setTimeout(fetchRecipes, 500); // debounce typing
  return () => clearTimeout(delay);
}, [searchQuery, dietFilter]); // ⬅️ watch both inputs


  const filteredRecipes = recipes
    .filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((recipe) =>
      dietFilter === "all" ? true : recipe.diets.includes(dietFilter)
    );

  const total = filteredRecipes.length;
  const avgTime =
    total > 0
      ? Math.round(
          filteredRecipes.reduce((sum, r) => sum + r.readyInMinutes, 0) / total
        )
      : 0;
  const maxTime =
    total > 0
      ? Math.max(...filteredRecipes.map((r) => r.readyInMinutes))
      : 0;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", backgroundColor: "black" }}>
      <h1 style={{ fontSize: "5rem", marginBottom: "1rem" }}>🍽 Recipe Dashboard</h1>

      {error && <p style={{ color: "red" }}>❌ Error: {error}</p>}

      {/* Summary Stats */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <div style={statStyle}>Total: {total}</div>
        <div style={statStyle}>Avg Time: {avgTime} min</div>
        <div style={statStyle}>Max Time: {maxTime} min</div>
      </div>

      {/* Search and Filter */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={inputStyle}
        />
        <select
          value={dietFilter}
          onChange={(e) => setDietFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="all">All Diets</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten free">Gluten Free</option>
          <option value="pescetarian">Pescetarian</option>
        </select>
      </div>

      {/* Recipe List */}
      {filteredRecipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        filteredRecipes.map((r) => (
          <div key={r.id} style={cardStyle}>
            <img src={r.image} alt={r.title} style={{ width: "250px", height: "250px", marginRight:"10px", flexShrink: 0, objectFit: "cover", borderRadius: "8px" }} />
            <div style={textContainerStyle}>
              <h2 style={{ margin: "0" }}>{r.title}</h2>
              <p>⏱ Ready in {r.readyInMinutes} min</p>
              <p>🥗 Diets: {r.diets?.join(", ") || "None"}</p>
              <p>
                <strong>📝 Ingredients:</strong>
                <ul style={{ marginTop: "0.25rem", paddingLeft: "1rem" , listStyleType: "none"}}>
                  {r.extendedIngredients?.slice(0, 5).map((ing) => (
                    <li key={ing.id}>{ing.original}</li>
                  ))}
                </ul>
              </p>
             <Link
                to={`/recipe/${r.id}`}
                style={{
                  backgroundColor: "#333",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  textDecoration: "none",
                  display: "inline-block",
                  marginTop: "0.5rem",
                  fontWeight: "bold",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                }}
              >
                View Details
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const statStyle = {
  padding: "1rem",
  backgroundColor: "#69A2EC",
  borderRadius: "8px",
  boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  minWidth: "100px",
};

const inputStyle = {
  padding: "0.5rem",
  fontSize: "1rem",
};

const cardStyle = {
  display: "flex",
  // alignItems: "flex-start",  
  // justifyContent: "center",  
  padding: "1rem",
  marginBottom: "1rem",
  backgroundColor: "#69A2EC",
  borderRadius: "8px",
  boxShadow: "0 0 5px rgba(0,0,0,0.1)",
};

const textContainerStyle = {
  marginLeft: "1rem",           
  flexDirection: "column",
  justifyContent: "flex-start",
  flex:1,
  alignItems: "flex-start",    
};

export default App;
