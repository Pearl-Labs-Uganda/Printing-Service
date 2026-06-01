"use client";
import { useState } from "react";
import Materials from "../components/Materials";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MaterialsPage() {
  const [selectedMat, setSelectedMat] = useState("PLA");
  return (
    <>
      <Navbar />
      <Materials selected={selectedMat} onSelect={(id) => setSelectedMat(id)} />
      <Footer />
    </>
  );
}