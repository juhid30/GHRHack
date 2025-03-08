from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import os
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
from serpapi import GoogleSearch

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Configure Google Gemini AI


@app.route('/')
def hello_world():
    return jsonify({'message': 'Hello, World!'})

@app.route('/generate-roadmap', methods=['POST'])
def generate_roadmap():
    if 'syllabus' not in request.files:
        return jsonify({"error": "Syllabus PDF is required"}), 400

    file = request.files['syllabus']
    year = request.form.get("year")
    university = request.form.get("university")

    if not year or not university:
        return jsonify({"error": "Year and University are required"}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    try:
        with open(file_path, "rb") as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            syllabus_text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])

        output = {
  "name": "Second Year B.E. IT Engineering",
  "children": [
    {
      "name": "Semester III",
      "children": [
        {
          "name": "Phase 1: Weeks 1-4 (Foundation)",
          "children": [
            {
              "name": "ITC401 (Engineering Mathematics IV)",
              "attributes": {
                "focus": "Linear Algebra",
                "resources": "NPTEL"
              }
            },
            {
              "name": "ITC402 (Computer Networks and Network Design)",
              "attributes": {
                "focus": "Introduction to Computer Networks"
              }
            },
            {
              "name": "ITC403 (Operating Systems)",
              "attributes": {
                "focus": "Fundamentals of Operating Systems"
              }
            }
          ]
        },
        {
          "name": "Phase 2: Weeks 5-8 (Core Concepts)",
          "children": [
            {
              "name": "ITC401 (Engineering Mathematics IV)",
              "attributes": {
                "focus": "Complex Integration and Z-Transform"
              }
            },
            {
              "name": "ITC402 (Computer Networks and Network Design)",
              "attributes": {
                "focus": "Network Layer"
              }
            }
          ]
        }
      ]
    },
    {
      "name": "Semester IV",
      "children": [
        {
          "name": "Phase 1: Weeks 14-17 (Mini-Project & Revision)",
          "children": [
            {
              "name": "Mini-Project 1B",
              "attributes": {
                "description": "Python-based automation project"
              }
            }
          ]
        }
      ]
    }
  ]
}

        # Generate roadmap using Gemini AI
        prompt = (f"Based on the following syllabus, generate a detailed study roadmap for a {year} student at {university}.\n\n"
                  f"Syllabus:\n{syllabus_text}\n\n"
                  "Also consider industry trends while generating the roadmap."
                  f"The output should be \n{output}\n in json format nothing more.and limit text in output to 20 words in each node") 

        genai.configure(api_key="AIzaSyBcox681xg8Y7ty5v8uUtOT7nV_tE-g8K8")

        model = genai.GenerativeModel(model_name='gemini-1.5-flash')
        response = model.generate_content(prompt)
        roadmap = response.text  # Adjust based on response structure

        return jsonify({"roadmap": roadmap})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(file_path)  # Clean up uploaded file

if __name__ == '__main__':
    app.run(debug=True, port=5001)





a