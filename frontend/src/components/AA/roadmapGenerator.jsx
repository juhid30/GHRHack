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
      let d = response.data.roadmap;
      d = d.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(d);
      setRoadmap(parsedData); // Set the parsed JSON data as roadmap
    } catch (error) {
      console.error("Error generating roadmap", error);
    }
    setLoading(false);
  };

  // Function to convert the roadmap JSON data into a structure that react-d3-tree can understand
  const convertToTreeData = (data) => {
    const traverse = (node) => {
      const newNode = { name: node.name, children: [] };

      if (node.children) {
        node.children.forEach((child) => {
          newNode.children.push(traverse(child));
        });
      }

      return newNode;
    };

    return traverse(data);
  };

  // Custom rendering function for tree nodes
  // Custom rendering function for tree nodes
  // Custom rendering function for tree nodes
  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => {
    // Generate a random color for each node for a colorful appearance
    const colors = ["#FF5733", "#3357FF"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Calculate the width of the rectangle based on the length of the node name
    const nodeNameLength = nodeDatum.name.length;
    const rectWidth = Math.max(100, nodeNameLength * 10); // Minimum width is 100, scaling based on name length
    const rectHeight = 30; // Adjust the height as needed to fit the text

    return (
      <g onClick={toggleNode}>
        {/* Rectangle with dynamic width */}
        <rect
          width={rectWidth} // Dynamic width based on the name length
          height={rectHeight} // Fixed height for the rectangle
          rx="10" // Rounded corners
          ry="10" // Rounded corners
          fill={color} // Random color for the rectangle
          stroke="#000" // Border color
          strokeWidth="1" // Border thickness
        />

        {/* Text inside the rectangle */}
        <foreignObject x={0} y={0} width={rectWidth} height={rectHeight}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: "20px",
              color: "#fff",
              wordWrap: "break-word", // Ensure wrapping of long words
              whiteSpace: "normal", // Allows the text to wrap onto multiple lines
              padding: "0 5px", // Padding inside the box to avoid text touching the edges
            }}
          >
            {nodeDatum.name}
          </div>
        </foreignObject>
      </g>
    );
  };

  const renderBackground = () => {
    return (
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#33FF57", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#3357FF", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
    );
  };

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
            id="treeWrapper"
            style={{
              width: "100%",
              height: "500px",
              background: "url('path/to/your/image.jpg')", // Or you can use the gradient like below
              backgroundColor: "url(#gradient1)", // Use the gradient background
              backgroundSize: "cover", // Cover entire area
            }}
          >
            <Tree
              data={convertToTreeData(roadmap)}
              orientation="vertical"
              renderCustomNodeElement={renderCustomNodeElement} // Apply custom node renderer
              transitionDuration={1000} // Set transition duration to make animation smoother
              nodeSize={{ x: 200, y: 100 }} // Control the space between nodes
              transitionEasing="ease-in-out" // Control the easing for smoother animations
            />
          </div>
        </div>
      )}
    </div>
  );
}
