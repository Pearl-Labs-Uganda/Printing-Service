"use client";
import { Box } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

const DEFAULT_MODEL_COLOR = 0xffffff;

const getColorHex = (colorName: string): number => {
  const colors: Record<string, number> = {
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
  files: File[];
  color: string;
  material: string;
  layerHeight?: number;
  infill?: number;
  quality?: number;
  quantity?: number;
}

interface PreviewTileProps {
  file: File;
  color: string;
  material: string;
  layerHeight?: number;
  infill?: number;
  quality?: number;
  quantity?: number;
}

function PreviewTile({ file, color, material, layerHeight, infill, quality, quantity }: PreviewTileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !stageRef.current) return;

    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setClearColor(0xf5f5f5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(-100, -100, -100);
    scene.add(backLight);

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
          meshRef.current.geometry.dispose();
          if (meshRef.current.material instanceof THREE.Material) {
            meshRef.current.material.dispose();
          }
        }

        const meshMaterial = new THREE.MeshPhongMaterial({
          color: DEFAULT_MODEL_COLOR,
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

    const handleResize = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(stage);
    window.addEventListener("resize", handleResize);

    let rotationX = 0;
    let rotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isPointerDown = false;
    let lastX = 0;
    let lastY = 0;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      rotationX += (targetRotationX - rotationX) * 0.1;
      rotationY += (targetRotationY - rotationY) * 0.1;

      if (meshRef.current) {
        meshRef.current.rotation.x = rotationX;
        meshRef.current.rotation.y = rotationY;
      }

      renderer.render(scene, camera);
    };

    animate();

    const onPointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Only start tracking if click is inside canvas bounds
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) {
        return;
      }
      isPointerDown = true;
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isPointerDown) return;

      const rect = canvas.getBoundingClientRect();
      
      // Only update rotation if pointer is still within canvas bounds
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) {
        return;
      }

      const dx = (event.clientX - lastX) / rect.width;
      const dy = (event.clientY - lastY) / rect.height;
      lastX = event.clientX;
      lastY = event.clientY;
      targetRotationY += dx * 0.5;
      targetRotationX += dy * 0.5;
    };

    const onPointerUp = (event: PointerEvent) => {
      isPointerDown = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      resizeObserver.disconnect();

      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        if (meshRef.current.material instanceof THREE.Material) {
          meshRef.current.material.dispose();
        }
        scene.remove(meshRef.current);
        meshRef.current = null;
      }

      renderer.dispose();
    };
  }, [file]);

  useEffect(() => {
    if (!meshRef.current || !(meshRef.current.material instanceof THREE.MeshPhongMaterial)) return;

    const colorHex = getColorHex(color.split(" ")[0]);
    const materialShiny: Record<string, number> = {
      PLA: 40,
      ABS: 50,
      PETG: 45,
      TPU: 30,
      Nylon: 55,
    };

    meshRef.current.material.color.setHex(colorHex);
    meshRef.current.material.shininess = (materialShiny[material] || 60) + (quality ? (quality - 1) * 30 : 0);
    meshRef.current.material.wireframe = false;

    const opacityLevel = infill ? Math.max(0.3, 1 - (100 - infill) / 150) : 1;
    meshRef.current.material.opacity = opacityLevel;
    meshRef.current.material.transparent = infill ? infill < 100 : false;

    if (quantity && quantity > 1) {
      const scale = Math.max(0.7, 1 - (quantity - 1) * 0.05);
      meshRef.current.scale.set(scale, scale, scale);
    } else {
      meshRef.current.scale.set(1, 1, 1);
    }

    if (layerHeight) {
      meshRef.current.material.flatShading = layerHeight >= 0.3;
      meshRef.current.material.needsUpdate = true;
    }
  }, [color, material, layerHeight, infill, quality, quantity]);

  return (
    <div className="preview-tile">
      <div className="preview-tile-label" title={file.name}>{file.name}</div>
      <div ref={stageRef} className="preview-stage preview-stage-grid-item">
        <canvas
          ref={canvasRef}
          className="preview-canvas"
          aria-label={`${file.name} 3D preview canvas`}
          style={{ cursor: "grab" }}
        />
      </div>
    </div>
  );
}

export default function Preview3D({ files, color, material, layerHeight, infill, quality, quantity }: Props) {
  return (
    <div className="preview-container">
      <div className="preview-header">
        <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)" }}>
          Live Preview
        </div>
      </div>

      {files.length === 0 ? (
        <div className="preview-stage">
          <div className="preview-empty">
            <Box size={34} strokeWidth={1.5} style={{ color: "var(--brand-blue)" }} />
            <div style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--brand-blue)" }}>
              3D Viewer Ready
            </div>
            <div style={{ fontSize: "0.85rem", maxWidth: 320 }}>
              Upload one or more STL files to render responsive live previews here.
            </div>
          </div>
        </div>
      ) : (
        <div className={`preview-grid ${files.length > 1 ? "multiple" : "single"}`}>
          {files.map((file) => (
            <PreviewTile
              key={`${file.name}-${file.size}-${file.lastModified}`}
              file={file}
              color={color}
              material={material}
              layerHeight={layerHeight}
              infill={infill}
              quality={quality}
              quantity={quantity}
            />
          ))}
        </div>
      )}

      <div className="preview-meta">
        {files.length > 0
          ? `${files.length} design${files.length > 1 ? "s" : ""} ready • Drag any preview to rotate`
          : "The preview automatically scales to your selected device size."}
      </div>
    </div>
  );
}