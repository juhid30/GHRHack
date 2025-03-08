import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Tree from "react-d3-tree";

export default function RoadmapGenerator() {
  const [formData, setFormData] = useState({
    year: "",
    university: "",
    syllabus: null,
  });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, syllabus: e.target.files[0] });
  };

  const generateRoadmap = async () => {
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("year", formData.year);
    formDataToSend.append("university", formData.university);
    formDataToSend.append("syllabus", formData.syllabus);

    try {
      const response = await axios.post(
        "http://localhost:5000/generate-roadmap",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const cleanedRoadmap = cleanRoadmapJSON(response.data.roadmap);
      setRoadmap(cleanedRoadmap);
      console.log(cleanedRoadmap);
    } catch (error) {
      console.error("Error generating roadmap", error);
    }
    setLoading(false);
  };

  const cleanRoadmapJSON = (roadmapData) => {
    // Implement the JSON cleaning logic here
    // For example, remove unwanted properties or sanitize the data
    return roadmapData; // Return the cleaned JSON
  };

  const convertToTreeData = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const root = { name: "Roadmap", children: [] };
    let currentParent = root;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      const depth = line.search(/\S/);

      const newNode = { name: trimmedLine, children: [] };

      if (depth === 0) {
        root.children.push(newNode);
        currentParent = newNode;
      } else {
        let parent = currentParent;
        while (parent.depth >= depth) {
          parent = parent.parent;
        }
        parent.children.push(newNode);
        newNode.parent = parent;
        newNode.depth = depth;
        currentParent = newNode;
      }
    });

    return root;
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
            name="university"
            placeholder="University"
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="file"
            name="syllabus"
            onChange={handleFileChange}
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
          <div id="treeWrapper" style={{ width: "100%", height: "500px" }}>
            <Tree data={convertToTreeData(roadmap)} orientation="vertical" />
          </div>
        </div>
      )}
    </div>
  );
}
