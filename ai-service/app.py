from flask import Flask, request, jsonify
import random

app = Flask(__name__)

# 🔮 prediction
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    return jsonify({
        "tomorrowOrders": random.randint(5, 15),
        "confidence": round(random.uniform(0.8, 0.95), 2),
        "trend": random.choice(["UP", "DOWN", "STABLE"])
    })


# 💬 chat
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json

    message = data.get("message", "").lower()
    stats = data.get("stats", {})

    response = "I don't understand 🤔"

    if "today" in message:
        response = f"Today you have {stats.get('today', 0)} orders 📦"

    elif "week" in message:
        response = f"This week you have {stats.get('week', 0)} orders 📊"

    elif "revenue" in message:
        response = f"Revenue today is {stats.get('revenueToday', 0)} dt 💰"

    elif "trend" in message:
        response = f"Current trend is {stats.get('trend', 'N/A')} 📈"

    return jsonify({"reply": response})


if __name__ == '__main__':
    app.run(port=5000)