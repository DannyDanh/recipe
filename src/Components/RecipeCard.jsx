import { useEffect, useState } from "react"

const RecipeCard = ({ recipe }) => {
  return (
    <div className="border rounded shadow p-4 flex gap-4 items-start">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-24 h-24 object-cover rounded"
      />
      <div>
        <h2 className="text-lg font-semibold">{recipe.title}</h2>
        <p>⏱ Ready in {recipe.readyInMinutes} min</p>
        <p>🥗 Diets: {recipe.diets.join(", ") || "None"}</p>
      </div>
    </div>
  );
};

export default RecipeCard;