import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "maintenance"
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age: Number(form.age),
        weight: Number(form.weight),
        height: Number(form.height),
        goal: form.goal
      })
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Diet Recommendation AI</h1>

      <form onSubmit={submitForm}>
        <input name="age" placeholder="Age" onChange={handleChange} />
        <br /><br />

        <input name="weight" placeholder="Weight (kg)" onChange={handleChange} />
        <br /><br />

        <input name="height" placeholder="Height (cm)" onChange={handleChange} />
        <br /><br />

        <select name="goal" onChange={handleChange}>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <br /><br />

        <button type="submit">Get Plan</button>
      </form>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Recommended Calories: {result.recommended_plan.calories}</h2>
          <ul>
            <li>Breakfast: {result.recommended_plan.meals.breakfast}</li>
            <li>Lunch: {result.recommended_plan.meals.lunch}</li>
            <li>Snack: {result.recommended_plan.meals.snack}</li>
            <li>Dinner: {result.recommended_plan.meals.dinner}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
