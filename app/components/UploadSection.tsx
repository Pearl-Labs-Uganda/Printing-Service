"use client";
import { useState, useRef, useCallback } from "react";
import { UploadCloud, FileText, CheckCircle, Settings } from "lucide-react";
import QuotePanel, { QuoteData } from "./QuotePanel";

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)",
};
const SELECT_STYLE: React.CSSProperties = {
  padding: "0.55rem 0.85rem", border: "1.5px solid var(--bg-container-high)",
  borderRadius: "var(--radius-sm)", fontFamily: "var(--font-body)", fontSize: "0.875rem",
  color: "var(--text-primary)", background: "var(--bg-surface)", outline: "none",
  appearance: "none" as const, width: "100%",
};

interface Props {
  selectedMat: string;
  matPrice: number;
  step: number;
  onStepChange: (s: number) => void;
  onPayOpen: (q: QuoteData, fileName: string) => void;
}

export default function UploadSection({ selectedMat, matPrice, step, onStepChange, onPayOpen }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [layer, setLayer] = useState("0.2");
  const [infill, setInfill] = useState("30");
  const [quality, setQuality] = useState("1.0");
  const [qty, setQty] = useState(1);
  const [colour, setColour] = useState("White");
  const inputRef = useRef<HTMLInputElement>(null);

  const calcQuote = useCallback(
    (f: File, lh: number, inf: number, ql: number, q: number, customCol: boolean) => {
      const baseWt = Math.max(14, (f.size / 1024) * 0.11 * (inf / 30));
      const wt = parseFloat((baseWt * ql).toFixed(1));
      const mins = Math.round(wt * (lh === 0.1 ? 4.5 : lh === 0.2 ? 2.8 : 1.8) * ql * q);
      const hrs = Math.floor(mins / 60), rm = mins % 60;
      const matCostTotal = Math.round(wt * matPrice * 1000) * q;
      const total = matCostTotal + 15000 + (customCol ? 5000 : 0);
      const half = Math.round(total / 2);
      return { wt, hrs, rm, qty: q, total, half, bal: total - half, customCol, mat: selectedMat, lh, inf };
    },
    [matPrice, selectedMat]
  );

  const runQuote = useCallback(
    (f: File, lh = layer, inf = infill, ql = quality, q = qty, col = colour) => {
      setQuoteStatus("loading");
      onStepChange(2);
      setTimeout(() => {
        const result = calcQuote(f, parseFloat(lh), parseInt(inf), parseFloat(ql), q, col.includes("Custom"));
        setQuote(result);
        setQuoteStatus("ready");
        onStepChange(3);
      }, 1600);
    },
    [calcQuote, layer, infill, quality, qty, colour, onStepChange]
  );

  const handleFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith(".stl")) return;
    setFile(f);
    onStepChange(2);
    runQuote(f);
  };

  const reCalc = (lh = layer, inf = infill, ql = quality, q = qty, col = colour) => {
    if (!file) return;
    runQuote(file, lh, inf, ql, q, col);
  };

  const progSteps = ["Upload", "Configure", "Quote", "Pay & Slice"];

  return (
    <section id="upload" style={{ padding: "72px 2rem", background: "var(--bg)" }}>
      <div className="container" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-label)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brand-orange)", marginBottom: "0.4rem" }}>
          Instant Quote
        </div>
        <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.4rem", letterSpacing: "-0.3px" }}>
          Upload &amp; Get Your Quote
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "2.5rem", maxWidth: 520, lineHeight: 1.7 }}>
          Upload your STL and configure settings to receive a precise instant estimate.
        </p>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2.5rem" }}>
          {progSteps.map((label, i) => {
            const n = i + 1;
            const isDone = n < step, isActive = n === step;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: 30, height: 30, borderRadius: "50%", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-label)", fontSize: "0.72rem", fontWeight: 700,
                      background: isDone ? "#22c55e" : isActive ? "var(--brand-blue)" : "var(--bg-container)",
                      border: `2px solid ${isDone ? "#22c55e" : isActive ? "var(--brand-blue)" : "var(--bg-dim)"}`,
                      color: isDone || isActive ? "#fff" : "var(--text-secondary)",
                      transition: "all 0.3s",
                    }}
                  >
                    {isDone ? <CheckCircle size={14} /> : n}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-label)", fontSize: "0.78rem",
                      color: isActive ? "var(--brand-blue)" : "var(--text-secondary)",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {label}
                  </span>
                </div>
                {i < 3 && (
                  <div style={{ width: 40, height: 2, background: "var(--bg-container)", margin: "0 6px" }} />
                )}
              </div>
            );
          })}
        </div>

        <div className="upload-grid" style={{ alignItems: "start" }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Upload Card */}
            <div style={{ background: "var(--bg-surface)", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "2rem", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <UploadCloud size={18} strokeWidth={1.5} /> Your STL File
              </div>

              {/* Drop zone */}
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                style={{
                  border: `2px dashed ${file ? "#22c55e" : dragOver ? "var(--brand-blue)" : "var(--bg-dim)"}`,
                  borderRadius: "var(--radius-md)", padding: "2.5rem 1.5rem",
                  textAlign: "center", cursor: "pointer",
                  background: dragOver ? "var(--bg-container-low)" : "transparent",
                  transition: "all 0.2s", marginBottom: file ? "1rem" : 0,
                }}
              >
                <input ref={inputRef} type="file" accept=".stl" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem", color: file ? "#22c55e" : "var(--brand-blue)" }}>
                  <UploadCloud size={32} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.4rem" }}>
                  Drop your STL file here
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>or click to browse</p>
                <div style={{ marginTop: "0.75rem", fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--brand-orange)" }}>
                  Accepted: .STL
                </div>
              </div>

              {/* File strip */}
              {file && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "var(--bg-container-low)", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem" }}>
                  <FileText size={20} strokeWidth={1.5} style={{ color: "var(--brand-blue)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: "block", fontSize: "0.875rem", color: "var(--brand-blue)", fontWeight: 600 }}>{file.name}</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-label)" }}>
                      {(file.size / 1024).toFixed(1)} KB · STL
                    </span>
                  </div>
                  <CheckCircle size={16} style={{ color: "#22c55e" }} />
                </div>
              )}
            </div>

            {/* Config Card */}
            <div style={{ background: "var(--bg-surface)", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "2rem", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Settings size={18} strokeWidth={1.5} /> Print Configuration
              </div>
              <div className="upload-config-grid">
                {/* Layer height */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={LABEL_STYLE}>Layer Height</label>
                  <select style={SELECT_STYLE} value={layer} onChange={(e) => { setLayer(e.target.value); reCalc(e.target.value); }}>
                    <option value="0.1">0.1mm — Fine</option>
                    <option value="0.2">0.2mm — Standard</option>
                    <option value="0.3">0.3mm — Draft</option>
                  </select>
                </div>
                {/* Infill */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={LABEL_STYLE}>Infill %</label>
                  <select style={SELECT_STYLE} value={infill} onChange={(e) => { setInfill(e.target.value); reCalc(undefined, e.target.value); }}>
                    <option value="15">15% — Hollow</option>
                    <option value="30">30% — Standard</option>
                    <option value="50">50% — Strong</option>
                    <option value="80">80% — Solid</option>
                    <option value="100">100% — Full</option>
                  </select>
                </div>
                {/* Quality */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={LABEL_STYLE}>Quality</label>
                  <select style={SELECT_STYLE} value={quality} onChange={(e) => { setQuality(e.target.value); reCalc(undefined, undefined, e.target.value); }}>
                    <option value="1.0">Standard</option>
                    <option value="1.3">High Quality</option>
                    <option value="1.6">Ultra Quality</option>
                  </select>
                </div>
                {/* Qty */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={LABEL_STYLE}>Quantity</label>
                  <input type="number" min={1} max={100} value={qty} style={SELECT_STYLE}
                    onChange={(e) => { const v = Math.max(1, parseInt(e.target.value) || 1); setQty(v); reCalc(undefined, undefined, undefined, v); }} />
                </div>
                {/* Colour */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", gridColumn: "1 / -1" }}>
                  <label style={LABEL_STYLE}>Colour</label>
                  <select style={SELECT_STYLE} value={colour} onChange={(e) => { setColour(e.target.value); reCalc(undefined, undefined, undefined, undefined, e.target.value); }}>
                    {["White","Black","Red","Blue","Green","Yellow","Custom Colour (+UGX 5,000)"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Quote */}
          <QuotePanel
            status={quoteStatus}
            quote={quote}
            onPay={() => { if (quote && file) onPayOpen(quote, file.name); }}
          />
        </div>
      </div>
    </section>
  );
}
