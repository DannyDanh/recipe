import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DetailView() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${API_KEY}`
        );
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe details.");
      }
    };

    fetchDetail();
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!recipe) return <p>Loading...</p>;

  const nutritionChartData = recipe.nutrition?.nutrients
    ?.filter(n => ["Calories", "Fat", "Carbohydrates", "Protein"].includes(n.name))
    .map(n => ({ name: n.name, value: n.amount }));

  const pieData = nutritionChartData?.filter(n => n.name !== "Calories");

  return (
    <div style={{ padding: "2rem", fontFamily: "Segoe UI", maxWidth: "900px", margin: "0 auto", color: "#f2f2f2", backgroundColor: "#1e1e1e" }}>
      <Link to="/" style={{ display: "inline-block", marginBottom: "1rem", padding: "0.5rem 1rem", backgroundColor: "#333", color: "#fff", borderRadius: "6px", textDecoration: "none" }}>
        ⬅️ Return to Home
      </Link>

      <h1 style={{ fontSize: "2.5rem", color: "#ffffff" }}>{recipe.title}</h1>
      <img src={recipe.image} alt={recipe.title} style={{ width: "100%", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.4)" }} />

      <section style={{ marginTop: "1.5rem" }}>
        <p dangerouslySetInnerHTML={{ __html: recipe.summary }}></p>
        <p><strong>⏱ Ready in:</strong> {recipe.readyInMinutes} minutes</p>
        <p><strong>🍽 Servings:</strong> {recipe.servings}</p>
        <p><strong>🥗 Diets:</strong> {recipe.diets.join(", ") || "None"}</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3 style={{ fontSize: "1.5rem", color: "#d3d3d3" }}>📝 Ingredients</h3>
        <p style={{ lineHeight: "1.6" }}>
          {recipe.extendedIngredients.map(ing => ing.original).join(", ")}
        </p>
      </section>

      {nutritionChartData && nutritionChartData.length > 0 && (
        <section style={{ marginTop: "2.5rem" }}>
          <h3 style={{ fontSize: "1.5rem", color: "#d3d3d3" }}>📊 Macronutrient Bar Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nutritionChartData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#69A2EC" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {pieData && pieData.length > 0 && (
        <section style={{ marginTop: "2.5rem" }}>
          <h3 style={{ fontSize: "1.5rem", color: "#d3d3d3" }}>🥧 Macronutrient Breakdown (Pie)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      )}
    </div>
  );
}
