import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Tree from "react-d3-tree";
import Navbar from "../Navbar";

export default function RoadmapGenerator() {
  const [formData, setFormData] = useState({
    year: "",
    university: "",
    syllabus: null,
  });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");

  // Color scheme
  const colors = {
    dark: {
      primary: "#20397F",
      secondary: "#000000",
    },
    light: {
      primary: "#CD6D8B",
      secondary: "#EEB6B3",
      tertiary: "#F6D8D1",
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormData({ ...formData, syllabus: file });
    }
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
      setRoadmap(parsedData);
    } catch (error) {
      console.error("Error generating roadmap", error);
    }
    setLoading(false);
  };

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

  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => {
    // Using the specified color scheme
    const nodeColors = [
      colors.dark.primary,
      colors.light.primary,
      colors.light.secondary,
    ];
    const color = nodeColors[Math.floor(Math.random() * nodeColors.length)];

    const nodeNameLength = nodeDatum.name.length;
    const rectWidth = Math.max(120, nodeNameLength * 8);
    const rectHeight = 36;

    // Determine text color based on background color for accessibility
    const textColor =
      color === colors.dark.primary ? "#fff" : colors.dark.primary;

    return (
      <g onClick={toggleNode}>
        <rect
          width={rectWidth}
          height={rectHeight}
          rx="4"
          ry="4"
          fill={color}
          stroke={colors.light.tertiary}
          strokeWidth="1"
        />
        <foreignObject x={0} y={0} width={rectWidth} height={rectHeight}>
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "500",
              color: textColor,
              wordWrap: "break-word",
              whiteSpace: "normal",
              padding: "0 8px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {nodeDatum.name}
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div
      className="max-w-[1000px] mx-auto p-6"
      style={{ backgroundColor: colors.light.tertiary + "20" }}
    >
      <div className="flex flex-col items-center mb-6">
        <Navbar />
      </div>
      <div
        className="mt-[6.2rem]"
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            color: colors.dark.primary,
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "24px",
          }}
        >
          Academic Roadmap
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              htmlFor="year"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: "500",
                color: colors.dark.primary,
              }}
            >
              Academic Year
            </label>
            <input
              id="year"
              name="year"
              placeholder="e.g., 2024-2025"
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "14px",
                color: colors.dark.secondary,
                borderRadius: "4px",
                border: "1px solid " + colors.light.secondary,
                backgroundColor: "#fff",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="university"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: "500",
                color: colors.dark.primary,
              }}
            >
              University Name
            </label>
            <input
              id="university"
              name="university"
              placeholder="e.g., Stanford University"
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "14px",
                color: colors.dark.secondary,
                borderRadius: "4px",
                border: "1px solid " + colors.light.secondary,
                backgroundColor: "#fff",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="syllabus"
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "14px",
                fontWeight: "500",
                color: colors.dark.primary,
              }}
            >
              Syllabus Document
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label
                htmlFor="syllabus-upload"
                style={{
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  backgroundColor: colors.dark.primary,
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Choose File
                <input
                  id="syllabus-upload"
                  type="file"
                  name="syllabus"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
              <span
                style={{
                  fontSize: "14px",
                  color: colors.dark.secondary,
                  opacity: "0.7",
                }}
              >
                {fileName}
              </span>
            </div>
          </div>

          <button
            onClick={generateRoadmap}
            disabled={loading}
            style={{
              marginTop: "8px",
              padding: "10px 16px",
              borderRadius: "4px",
              backgroundColor: colors.dark.primary,
              color: "#fff",
              fontSize: "14px",
              fontWeight: "500",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? "0.7" : "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
            }}
          >
            {loading ? (
              <>
                <Loader2
                  style={{
                    animation: "spin 1s linear infinite",
                    marginRight: "8px",
                    height: "18px",
                    width: "18px",
                  }}
                />
                Generating...
              </>
            ) : (
              "Generate Roadmap"
            )}
          </button>
        </div>
      </div>

      {roadmap && (
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "24px",
            marginTop: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              color: colors.dark.primary,
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            Your Academic Journey
          </h2>

          <div
            style={{
              borderRadius: "6px",
              overflow: "hidden",
              border: "1px solid " + colors.light.tertiary,
              backgroundColor: colors.light.tertiary + "30",
            }}
          >
            <div
              id="treeWrapper"
              style={{
                width: "100%",
                height: "600px",
                backgroundImage: `linear-gradient(to right, ${colors.light.tertiary}10 1px, transparent 1px), linear-gradient(to bottom, ${colors.light.tertiary}10 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            >
              <Tree
                data={convertToTreeData(roadmap)}
                orientation="vertical"
                renderCustomNodeElement={renderCustomNodeElement}
                transitionDuration={500}
                nodeSize={{ x: 200, y: 80 }}
                separation={{ siblings: 1.5, nonSiblings: 2 }}
                pathFunc="step"
                pathClassFunc={() => "stroke-path"}
                styles={{
                  links: {
                    stroke: colors.light.secondary,
                    strokeWidth: 1.5,
                  },
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              borderRadius: "4px",
              backgroundColor: colors.light.tertiary + "30",
              border: "1px solid " + colors.light.tertiary,
            }}
          >
            <p
              style={{
                fontSize: "13px",
                color: colors.dark.primary,
                margin: 0,
              }}
            >
              <strong>Tip:</strong> Click on nodes to expand or collapse
              branches. Drag to pan the view.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
