from flask import Flask, jsonify, request
import requests

app = Flask(__name__)
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response
@app.route('/')
def hello_world():
    return jsonify({'message': 'Hello, World!'})

@app.route("/api/generate-roadmap", methods=["POST"])
def generate_roadmap():
    data = request.json
    year = data.get("year")
    branch = data.get("branch")
    notes = data.get("notes")
    university = data.get("university")
    syllabus = data.get("webcode")
    
    try:
        ai_response = requests.post("https://your-agentic-ai-api.com/generate-roadmap", json={
            "year": year,
            "branch": branch,
            "notes": notes,
            "university": university,
            "syllabus": syllabus,
        })
        return jsonify(ai_response.json())
    except Exception as e:
        return jsonify({"error": "Failed to generate roadmap", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
