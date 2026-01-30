from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    age: int
    weight: float
    height: float
    goal: str

@app.get("/")
def home():
    return {"message": "Diet AI backend is running!"}

@app.post("/recommend")
def recommend(data: UserInput):

    BMR = 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
    TDEE = BMR * 1.55

    if data.goal == "weight_loss":
        target_calories = TDEE - 400
    elif data.goal == "muscle_gain":
        target_calories = TDEE + 300
    else:
        target_calories = TDEE

    meals_db = {
        "breakfast": ["Oats with almonds", "Egg omelette + toast", "Smoothie bowl", "Poha"],
        "lunch": ["Rice + chicken", "Roti + dal", "Paneer + rice", "Salad"],
        "snack": ["Fruit bowl", "Protein shake", "Dry fruits", "Yogurt"],
        "dinner": ["Grilled chicken", "Khichdi", "Paneer curry", "Soup"]
    }

    plan = {
        "calories": round(target_calories),
        "meals": {
            "breakfast": random.choice(meals_db["breakfast"]),
            "lunch": random.choice(meals_db["lunch"]),
            "snack": random.choice(meals_db["snack"]),
            "dinner": random.choice(meals_db["dinner"])
        }
    }

    return {
        "bmr": round(BMR),
        "tdee": round(TDEE),
        "recommended_plan": plan
    }
