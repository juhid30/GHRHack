/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as d3 from "d3"; // Import D3.js

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

  const [font, setFont] = useState(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (loadedFont) => {
        setFont(loadedFont);
      },
      undefined,
      (error) => {
        console.error("Error loading font:", error);
      }
    );
  }, []);

  useEffect(() => {
    if (roadmap) {
      // Initialize the 3D scene (still using Three.js for any 3D rendering)
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

      const light = new THREE.AmbientLight(0xffffff);
      scene.add(light);
      const light2 = new THREE.PointLight(0xffffff, 1, 500);
      light2.position.set(0, 0, 500);
      scene.add(light2);
      camera.position.z = 500;

      buildTree(roadmap, scene, null, font);

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();

      // Create the D3 tree
      createD3Tree(roadmap);
    }
  }, [roadmap, treeDimensions, font]);

  const buildTree = (
    data,
    scene,
    parent,
    font,
    level = 0,
    xOffset = 0,
    yOffset = 0
  ) => {
    const distance = 100;
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
    } else if (data && data.name) {
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

    if (font) {
      const textGeometry = new TextGeometry(node.name, {
        font: font,
        size: 10,
        height: 1,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(xOffset + 20, yOffset, 0);
      scene.add(textMesh);
    }

    mesh.onClick = () => {
      mesh.scale.set(1.5, 1.5, 1.5);
      setTimeout(() => {
        mesh.scale.set(1, 1, 1);
      }, 300);
    };

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

  const createD3Tree = (data) => {
    // Set up the D3 tree layout
    const width = treeDimensions.width;
    const height = treeDimensions.height;

    const margin = { top: 20, right: 90, bottom: 30, left: 90 };
    const treemap = d3.tree().size([height, width - 160]);

    const root = d3.hierarchy(data, (d) => d.children);
    treemap(root);

    const svg = d3
      .select(treeContainerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Links
    const links = svg
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", (d) => {
        return (
          "M" +
          d.source.y +
          "," +
          d.source.x +
          "C" +
          (d.source.y + d.target.y) / 2 +
          "," +
          d.source.x +
          " " +
          (d.source.y + d.target.y) / 2 +
          "," +
          d.target.x +
          " " +
          d.target.y +
          "," +
          d.target.x
        );
      })
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2);

    // Nodes
    const nodes = svg
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => "translate(" + d.y + "," + d.x + ")");

    nodes
      .append("circle")
      .attr("r", 10)
      .attr("fill", (d) => (d.children ? "lightsteelblue" : "#fff"))
      .attr("stroke", "#3182bd")
      .attr("stroke-width", 2)
      .on("click", (event, d) => {
        // Animate node on click
        d3.select(event.currentTarget)
          .transition()
          .duration(300)
          .attr("r", 15)
          .transition()
          .duration(300)
          .attr("r", 10);
      });

    nodes
      .append("text")
      .attr("dy", 3)
      .attr("x", (d) => (d.children ? -12 : 12))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name);
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
      console.log("Raw API Response:", roadmapData);
      roadmapData = roadmapData.replace(/```json\n?|\n?```/g, "").trim();

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
