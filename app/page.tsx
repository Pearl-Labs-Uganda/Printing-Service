"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadSection from "./components/UploadSection";
import PaymentModal from "./components/PaymentModal";
import SuccessModal from "./components/SuccessModal";
import Footer from "./components/Footer";
import { QuoteData } from "./components/QuotePanel";

export default function Home() {
  const [step, setStep] = useState(1);
  const [selectedMat, setSelectedMat] = useState("PLA");
  const [matPrice, setMatPrice] = useState(0.5);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [payOpen, setPayOpen] = useState(false);
  const [payQuote, setPayQuote] = useState<QuoteData | null>(null);
  const [payFile, setPayFile] = useState("");

  const [successOpen, setSuccessOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePayOpen = (q: QuoteData, fileName: string) => {
    setPayQuote(q);
    setPayFile(fileName);
    setPayOpen(true);
  };

  return (
    <>
      <Navbar />
      <Hero />

      {orderPlaced && (
        <div
          style={{
            maxWidth: 1100,
            margin: "1rem auto 0",
            padding: "1rem 1.25rem",
            borderRadius: "var(--radius-lg)",
            background: "#e7f5ff",
            border: "1px solid #bae6fd",
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ fontFamily: "var(--font-headline)", fontWeight: 700, marginBottom: "0.2rem" }}>
              Your print order is in progress.
            </div>
            <p style={{ margin: 0, color: "#334155", fontSize: "0.95rem" }}>
              We received your deposit and printing has started. Estimated ready time: <strong>{payQuote?.readyAt ?? "Pending"}</strong>.
            </p>
          </div>
          <button
            onClick={() => setSuccessOpen(true)}
            style={{
              borderRadius: "var(--radius-sm)",
              border: "1px solid #5b9bff",
              background: "#2563eb",
              color: "#fff",
              padding: "0.85rem 1.25rem",
              fontFamily: "var(--font-label)",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Track order
          </button>
        </div>
      )}

      <UploadSection
        selectedMat={selectedMat}
        matPrice={matPrice}
        step={step}
        orderPlaced={orderPlaced}
        onStepChange={setStep}
        onPayOpen={handlePayOpen}
        onFilesChange={setUploadedFiles}
        onMatChange={(matId, price) => {
          setSelectedMat(matId);
          setMatPrice(price);
        }}
      />
      <Footer />

      <PaymentModal
        open={payOpen}
        quote={payQuote}
        fileName={payFile}
        onClose={() => setPayOpen(false)}
      />
      <SuccessModal
        open={successOpen}
        orderId={orderId}
        readyAt={payQuote?.readyAt ?? "Pending"}
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
}