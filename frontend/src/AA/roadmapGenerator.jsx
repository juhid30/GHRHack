import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function RoadmapGenerator() {
  const [formData, setFormData] = useState({
    year: "",
    branch: "",
    notes: "",
    university: "",
    syllabus: "",
  });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/generate-roadmap",
        formData
      );
      setRoadmap(response.data);
    } catch (error) {
      console.error("Error generating roadmap", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4">Roadmap Generator</h2>
        <div className="space-y-4">
          <input
            name="year"
            placeholder="Year"
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            name="branch"
            placeholder="Branch"
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            name="notes"
            placeholder="Notes"
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            name="university"
            placeholder="University"
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            name="syllabus"
            placeholder="Syllabus"
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <button
            onClick={generateRoadmap}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              "Generate Roadmap"
            )}
          </button>
        </div>
      </div>

      {roadmap && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Generated Roadmap</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md text-sm">
            {JSON.stringify(roadmap, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
