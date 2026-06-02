"use client";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const getColorHex = (colorName: string): number => {
  const colors: { [key: string]: number } = {
    White: 0xffffff,
    Black: 0x000000,
    Red: 0xff0000,
    Blue: 0x0066ff,
    Green: 0x00aa00,
    Yellow: 0xffff00,
  };
  return colors[colorName] || 0xffffff;
};

interface Props {
  file: File | null;
  color: string;
  material: string;
}

export default function Preview3D({ file, color, material }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !file) return;

    // Initialize Three.js scene
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 150;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-100, -100, -100);
    scene.add(backLight);

    // Load STL file
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
const loader = new STLLoader();

try {
  const geometry = loader.parse(arrayBuffer);

  geometry.computeBoundingBox();

  const bbox = geometry.boundingBox;
  if (!bbox) return;

  const center = new THREE.Vector3();
  bbox.getCenter(center);
  geometry.translate(-center.x, -center.y, -center.z);

  const size = new THREE.Vector3();
  bbox.getSize(size);

  const maxDim = Math.max(size.x, size.y, size.z);

  if (maxDim > 0) {
    const scale = 100 / maxDim;
    geometry.scale(scale, scale, scale);
  }

  if (meshRef.current) {
    scene.remove(meshRef.current);
  }

  const meshMaterial = new THREE.MeshPhongMaterial({
    color: getColorHex(color.split(" ")[0]),
    shininess: 60,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, meshMaterial);

  meshRef.current = mesh;
  scene.add(mesh);

} catch (error) {
  console.error("Failed to load STL:", error);
}
    };

    reader.readAsArrayBuffer(file);

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    let rotationX = 0;
    let rotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth rotation
      rotationX += (targetRotationX - rotationX) * 0.1;
      rotationY += (targetRotationY - rotationY) * 0.1;

      if (meshRef.current) {
        meshRef.current.rotation.x = rotationX;
        meshRef.current.rotation.y = rotationY;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse interaction
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      targetRotationY = (x - 0.5) * Math.PI;
      targetRotationX = (y - 0.5) * Math.PI;
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [file]);

  // Update color when it changes
  useEffect(() => {
    if (!meshRef.current || !file) return;

    const colorHex = getColorHex(color.split(" ")[0]);
    if (meshRef.current.material instanceof THREE.MeshPhongMaterial) {
      meshRef.current.material.color.setHex(colorHex);
    }
  }, [color, file]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", height: "100%" }}>
      <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)" }}>
        Live Preview
      </div>
      <canvas
        ref={canvasRef}
        style={{
          borderRadius: "var(--radius-lg)",
          border: "1.5px solid var(--bg-container)",
          flex: 1,
          minHeight: 400,
          cursor: "grab",
          background: "#f5f5f5",
        }}
      />
      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center", padding: "0.5rem" }}>
        Drag to rotate • Color: {color.includes("Custom") ? "Custom" : color}
      </div>
    </div>
  );
}
