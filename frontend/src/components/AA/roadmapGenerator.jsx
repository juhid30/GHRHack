import { useState, useEffect, useRef } from "react";
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
  const treeContainerRef = useRef(null);
  const [treeDimensions, setTreeDimensions] = useState({
    width: 800,
    height: 500,
  });

  useEffect(() => {
    if (treeContainerRef.current) {
      setTreeDimensions({
        width: treeContainerRef.current.offsetWidth,
        height: 600,
      });
    }
  }, [roadmap]);

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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      let roadmapData = response.data.roadmap;

      // Debug: Print raw response
      console.log("Raw API Response:", roadmapData);

      // Remove unwanted Markdown formatting if present
      roadmapData = roadmapData.replace(/```json|```/g, "").trim();

      // Ensure valid JSON format
      if (typeof roadmapData === "string") {
        roadmapData = JSON.parse(roadmapData);
      }

      setRoadmap(roadmapData);
    } catch (error) {
      console.error("Error generating roadmap", error);
    }
    setLoading(false);
  };

  const renderCustomNode = ({ nodeDatum, toggleNode }) => (
    <g>
      <circle
        r={15}
        fill={nodeDatum.children ? "#1D4ED8" : "#22C55E"}
        onClick={toggleNode}
      />
      <text x={20} dy={5} fontSize={14} fontWeight="">
        {nodeDatum.name}
      </text>
      {nodeDatum.attributes && (
        <foreignObject width="200" height="60" x={25} y={10}>
          <div
            style={{
              background: "#F1F5F9",
              padding: "5px",
              borderRadius: "5px",
              fontSize: "12px",
            }}
          >
            {Object.entries(nodeDatum.attributes).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        </foreignObject>
      )}
    </g>
  );

  return (
    <div className="max-w-[1000px] mx-auto p-6 space-y-6">
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
          <div
            ref={treeContainerRef}
            style={{ width: "100%", height: "600px" }}
          >
            <Tree
              data={roadmap}
              orientation="vertical"
              translate={{ x: treeDimensions.width / 2, y: 100 }}
              renderCustomNodeElement={renderCustomNode}
              nodeSize={{ x: 200, y: 150 }}
              separation={{ siblings: 1, nonSiblings: 2 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
