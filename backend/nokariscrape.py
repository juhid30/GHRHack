import requests
from bs4 import BeautifulSoup

# Headers to simulate a real browser visit
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Function to scrape jobs from Naukri.com
def scrape_naukri(job_title, location, max_jobs=10):
    job_title = job_title.replace(" ", "-")
    location = location.replace(" ", "-")
    
    # Construct the search URL
    base_url = f"https://www.naukri.com/{job_title}-jobs-in-{location}"
    response = requests.get(base_url, headers=HEADERS)
    
    if response.status_code != 200:
        print("Failed to fetch Naukri jobs")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    jobs = []

    job_cards = soup.find_all("article", class_="jobTuple", limit=max_jobs)
    
    for job in job_cards:
        title_elem = job.find("a", class_="title")
        company_elem = job.find("a", class_="subTitle")
        location_elem = job.find("li", class_="location")

        if title_elem and company_elem:
            title = title_elem.text.strip()
            company = company_elem.text.strip()
            job_link = title_elem["href"]
            job_location = location_elem.text.strip() if location_elem else "Not specified"
            
            jobs.append({
                "title": title,
                "company": company,
                "location": job_location,
                "link": job_link
            })

    return jobs


# Example Usage
job_title = "software engineer"
location = "bangalore"

print(f"Fetching jobs for {job_title} in {location} from Naukri.com...\n")
naukri_jobs = scrape_naukri(job_title, location)

for idx, job in enumerate(naukri_jobs, 1):
    print(f"{idx}. {job['title']} at {job['company']} ({job['location']})")
    print(f"   Apply: {job['link']}\n")