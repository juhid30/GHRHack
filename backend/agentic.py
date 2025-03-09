import fitz  # PyMuPDF
from google import genai
from langchain.llms import OpenAI
from langchain.agents import initialize_agent, AgentType

def extract_text_from_pdf(pdf_path):
    text = ""
    doc = fitz.open(pdf_path)
    for page in doc:
        text += page.get_text()
    return text

# Example: Extract text from multiple PDFs
pdf_files = ["syllabus.pdf", "notes1.pdf", "notes2.pdf"]
text_data = [extract_text_from_pdf(pdf) for pdf in pdf_files]



client = genai.Client(api_key="AIzaSyDOky3a0Mpbe13I6Zo4t-RZ-pt4F8NbG5I")

# Prepare fine-tuning data
training_data = [{"input": txt[:500], "output": txt[500:1000]} for txt in text_data]

response = client.models.fine_tune(
    model="gemini-2.0",
    training_data=training_data
)
fine_tuned_model_id = response.model_id



llm = OpenAI(model_name=fine_tuned_model_id)

agent = initialize_agent(
    tools=[],  # Add custom tools if needed
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# Test the agent
response = agent.run("Explain module 3 of the syllabus.")
print(response)

