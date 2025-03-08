import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"; // Correct import for FontLoader
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"; // Import TextGeometry

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

  const [font, setFont] = useState(null); // State to store the loaded font

  useEffect(() => {
    // Load the font asynchronously and store it in the state
    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json", // Updated font URL
      (loadedFont) => {
        setFont(loadedFont); // Store the font in the state once it's loaded
      },
      undefined,
      (error) => {
        console.error("Error loading font:", error);
      }
    );
  }, []);

  useEffect(() => {
    if (roadmap && font) {
      // Initialize the 3D scene
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        treeDimensions.width / treeDimensions.height,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(treeDimensions.width, treeDimensions.height);
      treeContainerRef.current.appendChild(renderer.domElement);

      const light = new THREE.AmbientLight(0xffffff); // Ambient light
      scene.add(light);

      const light2 = new THREE.PointLight(0xffffff, 1, 500);
      light2.position.set(0, 0, 500);
      scene.add(light2);

      camera.position.z = 500;

      buildTree(roadmap, scene, null, font); // Pass the loaded font to the tree building function

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
    }
  }, [roadmap, treeDimensions, font]); // Run this effect when roadmap or font changes

  const buildTree = (
    data,
    scene,
    parent,
    font,
    level = 0,
    xOffset = 0,
    yOffset = 0
  ) => {
    const distance = 100; // Distance between nodes

    // If data is an array, iterate through the array
    if (Array.isArray(data)) {
      data.forEach((node, index) => {
        createNode(
          node,
          scene,
          parent,
          font,
          level,
          xOffset,
          yOffset,
          distance
        );
      });
    }
    // If data is a single object (like the root node), create the root node
    else if (data && data.name) {
      createNode(data, scene, parent, font, level, xOffset, yOffset, distance);
    }
  };

  const createNode = (
    node,
    scene,
    parent,
    font,
    level,
    xOffset,
    yOffset,
    distance
  ) => {
    const material = new THREE.MeshBasicMaterial({
      color: node.children ? 0x1d4ed8 : 0x22c55e,
    });
    const geometry = new THREE.SphereGeometry(15);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(xOffset, yOffset, 0);
    scene.add(mesh);

    // Create a text label for the node, only if the font is available
    if (font) {
      const textGeometry = new TextGeometry(node.name, {
        // Use TextGeometry correctly here
        font: font,
        size: 10,
        height: 1,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(xOffset + 20, yOffset, 0);
      scene.add(textMesh);
    }

    // Add interaction to animate on click
    mesh.onClick = () => {
      mesh.scale.set(1.5, 1.5, 1.5); // Scale up on click for animation
      setTimeout(() => {
        mesh.scale.set(1, 1, 1); // Scale back down after animation
      }, 300);
    };

    // If the node has children, create the child nodes recursively
    if (node.children) {
      buildTree(
        node.children,
        scene,
        mesh,
        font,
        level + 1,
        xOffset - distance,
        yOffset + distance
      );
      buildTree(
        node.children,
        scene,
        mesh,
        font,
        level + 1,
        xOffset + distance,
        yOffset + distance
      );
    }
  };

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
          />
        </div>
      )}
    </div>
  );
}
