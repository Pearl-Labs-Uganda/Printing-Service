"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadSection from "./components/UploadSection";
import SlicerSection from "./components/SlicerSection";
import PaymentModal from "./components/PaymentModal";
import SuccessModal from "./components/SuccessModal";
import Footer from "./components/Footer";
import { QuoteData } from "./components/QuotePanel";

export default function Home() {
  const [step, setStep] = useState(1);
  const [slicerUnlocked, setSlicerUnlocked] = useState(false);

  const [payOpen, setPayOpen] = useState(false);
  const [payQuote, setPayQuote] = useState<QuoteData | null>(null);
  const [payFile, setPayFile] = useState("");

  const [successOpen, setSuccessOpen] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handlePayOpen = (q: QuoteData, fileName: string) => {
    setPayQuote(q);
    setPayFile(fileName);
    setPayOpen(true);
  };

  const handleSuccess = (id: string) => {
    setPayOpen(false);
    setOrderId(id);
    setSuccessOpen(true);
    setStep(4);
  };

  const handleViewSlicer = () => {
    setSlicerUnlocked(true);
    setTimeout(() => {
      document.getElementById("slicer")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <Navbar />
      <Hero />
      <UploadSection
        selectedMat="PLA"
        matPrice={2.5}
        step={step}
        onStepChange={setStep}
        onPayOpen={handlePayOpen}
      />
      <SlicerSection
        unlocked={slicerUnlocked}
        onUnlockClick={() => {
          document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <Footer />

      <PaymentModal
        open={payOpen}
        quote={payQuote}
        fileName={payFile}
        onClose={() => setPayOpen(false)}
        onSuccess={handleSuccess}
      />
      <SuccessModal
        open={successOpen}
        orderId={orderId}
        onClose={() => setSuccessOpen(false)}
        onViewSlicer={handleViewSlicer}
      />
    </>
  );
}