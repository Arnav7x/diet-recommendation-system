import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "maintenance",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:9000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(form.age),
          weight: Number(form.weight),
          height: Number(form.height),
          goal: form.goal,
        }),
      });

      if (!response.ok) throw new Error("Backend error");

      const data = await response.json();
      setResult(data);
    } catch {
      setError("Could not fetch diet plan. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Diet Recommendation AI
        </h1>

        <form onSubmit={submitForm} className="space-y-4">
          <input  
            className="w-full border p-2 rounded"
            name="age"
            placeholder="Age"
            onChange={handleChange}
            required
          />

          <input
            className="w-full border p-2 rounded"
            name="weight"
            placeholder="Weight (kg)"
            onChange={handleChange}
            required
          />

          <input
            className="w-full border p-2 rounded"
            name="height"
            placeholder="Height (cm)"
            onChange={handleChange}
            required
          />

          <select
            className="w-full border p-2 rounded"
            name="goal"
            onChange={handleChange}
          >
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <button
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            type="submit"
            disabled={loading}
          >
            {loading ? "Calculating..." : "Get Diet Plan"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-2">
              Daily Calories: {result.recommended_plan.calories}
            </h2>
            <ul className="text-sm space-y-1">
              <li>Breakfast: {result.recommended_plan.meals.breakfast}</li>
              <li>Lunch: {result.recommended_plan.meals.lunch}</li>
              <li>Snack: {result.recommended_plan.meals.snack}</li>
              <li>Dinner: {result.recommended_plan.meals.dinner}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
