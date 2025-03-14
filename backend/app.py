from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import os
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
from serpapi import GoogleSearch

from python import python_routes
from public_speaking import pub_speak
from analyzer import anal_routes
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from urllib.robotparser import RobotFileParser

app = Flask(__name__)
CORS(app, origins="*")

app.register_blueprint(python_routes, url_prefix="/python")
app.register_blueprint(pub_speak, url_prefix="/pub-speaker")
app.register_blueprint(anal_routes, url_prefix="/analyzer")
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
SERP_API_KEY = os.getenv("SERP_API_KEY")
# Configure Google Gemini AI


@app.route('/')
def hello_world():
    return jsonify({'message': 'Hello, World!'})
@app.route('/search', methods=['POST'])
def search_serpapi():
    data = request.get_json()  # Get JSON data from the request
    if not data or "query" not in data:
        return jsonify({"error": "Missing 'query' in request"}), 400
    
    query = data["query"]
    params = {
        "q": query,
        "location": "India",
        "hl": "en",
        "gl": "us",
        "google_domain": "google.com",
        "api_key": SERP_API_KEY  # Replace with your actual API key
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    return results
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

        genai.configure(api_key="AIzaSyDOky3a0Mpbe13I6Zo4t-RZ-pt4F8NbG5I")

        model = genai.GenerativeModel(model_name='gemini-1.5-flash')
        response = model.generate_content(prompt)
        roadmap = response.text  # Adjust based on response structure

        return jsonify({"roadmap": roadmap})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(file_path)  # Clean up uploaded file


# @app.route('/save-audio', methods=['POST'])
# def save_audio():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part in the request'}), 400

#     file = request.files['file']

#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400

#     if file:
#         filename = secure_filename(file.filename)
#         filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         file.save(filepath)  # Save the file locally

#         return jsonify({'fileUrl': f'/temp/{filename}'})


@app.route("/get-events", methods=["POST"])
def get_events():
    
    if 'syllabus' not in request.files:
        return jsonify({"error": "Syllabus PDF is required"}), 400
    try:
        knows = request.form.get("knows")
        wantsToBe = request.form.get("wantsToBe")
        hobbies = request.form.get("hobbies")

        syllabus_text = ""
        if "syllabus" in request.files:
            file = request.files["syllabus"]
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
            file.save(file_path)

            with open(file_path, "rb") as pdf_file:
                reader = PyPDF2.PdfReader(pdf_file)
                syllabus_text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
            
            os.remove(file_path)  # Clean up uploaded file
        output = [
    { "title": "Hackathon Kickoff", "start": "2025-03-05", "allDay": "true" },
    { "title": "Team Building Day", "start": "2025-03-12", "allDay": "true" },
    { "title": "Project Deadline", "start": "2025-03-05", "allDay": "true" },
  ]

        prompt = (
            f"User knows: {knows}, Wants to be: {wantsToBe}, Hobbies: {hobbies}.\n"
            "Based on the following syllabus, generate personalized learning events.Students aslo have to learn about topics in the syllubus so half of the events should be related to the syllabus :\n"
            f"this is Syllabus:\n{syllabus_text}\n\n"
            f"Output should be in format like : \n{output}\n and nothing more. Dates should be of 2025 March."
            "I just want json data nothing else as response."
        )

        genai.configure(api_key="AIzaSyDOky3a0Mpbe13I6Zo4t-RZ-pt4F8NbG5I")

        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        response = model.generate_content(prompt)
        events = response.text.strip()  # Adjust based on response structure

        return jsonify({"events": events})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0"
}


def can_scrape_naukri():
    robots_url = "https://www.naukri.com/robots.txt"
    rp = RobotFileParser()
    rp.set_url(robots_url)
    rp.read()
    return rp.can_fetch("*", "https://www.naukri.com/jobs")

def scrape_naukri_bs4(job_title, location="india", max_jobs=10):
    if not can_scrape_naukri():
        return {"error": "Scraping Naukri is disallowed by robots.txt"}

    job_title = job_title.replace(" ", "-")
    location = location.replace(" ", "-")

    base_url = f"https://www.naukri.com/{job_title}-jobs-in-{location}"
    response = requests.get(base_url, headers=HEADERS)

    if response.status_code != 200:
        return {"error": "Failed to fetch jobs, Naukri might have blocked the request"}

    soup = BeautifulSoup(response.text, "html.parser")
    job_cards = soup.find_all("article", class_="jobTuple")  # Adjust selector if needed

    jobs = []
    for job in job_cards[:max_jobs]:
        try:
            title_elem = job.find("a", class_="title")
            company_elem = job.find("a", class_="subTitle")
            location_elem = job.find("li", class_="location")

            title = title_elem.text.strip() if title_elem else "N/A"
            company = company_elem.text.strip() if company_elem else "N/A"
            job_link = title_elem["href"] if title_elem else "#"
            job_location = location_elem.text.strip() if location_elem else "Not specified"

            jobs.append({
                "title": title,
                "company": company,
                "location": job_location,
                "link": job_link
            })
        except Exception as e:
            print(f"Error parsing job details: {e}")

    return jobs


@app.route("/get-jobs", methods=["POST"])
def get_jobs():
    data = request.json
    print(data)

    # genai.configure(api_key="AIzaSyDOky3a0Mpbe13I6Zo4t-RZ-pt4F8NbG5I")

    # model = genai.GenerativeModel(model_name="gemini-1.5-flash")

    # prompt = (f"Give me jobs of the following jobs: {data}.\nI just want json data nothing else as response.")

    # response = model.generate_content(prompt)

    # return jsonify({"jobs": response.text.strip()})  # Adjust based on response

    if isinstance(data, list):  
        job_titles = data
    elif isinstance(data, dict):
        job_titles = data.get("posts", [])
    else:
        return jsonify({"error": "Invalid request format"}), 400

    all_jobs = {}
    
    for job_title in job_titles:
        all_jobs[job_title] = scrape_naukri_bs4(job_title)

    return jsonify({"jobs": all_jobs})

    
    

if __name__ == '__main__':
    app.run(debug=True)
