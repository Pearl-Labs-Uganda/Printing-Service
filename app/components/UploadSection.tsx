"use client";
import { useState, useRef, useCallback } from "react";
import { UploadCloud, FileText, CheckCircle, Settings } from "lucide-react";
import QuotePanel, { QuoteData } from "./QuotePanel";
import PreviewGallery from "./PreviewGallery";
import { MATERIALS } from "./Materials";

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
  orderPlaced?: boolean;
  onStepChange: (s: number) => void;
  onPayOpen: (q: QuoteData, fileName: string) => void;
  onFilesChange?: (files: File[]) => void;
  onMatChange?: (matId: string, price: number) => void;
}

export default function UploadSection({ selectedMat, matPrice, step, orderPlaced = false, onStepChange, onPayOpen, onFilesChange, onMatChange }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [layer, setLayer] = useState("0.2");
  const [infill, setInfill] = useState("30");
  const [quality, setQuality] = useState("1.0");
  const [qty, setQty] = useState(1);
  const [colour, setColour] = useState("White");
  const [printType, setPrintType] = useState<"FDM" | "SLS">("FDM");
  const [postProcessing, setPostProcessing] = useState("None");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fileSummary = files.length === 1 ? files[0].name : `${files.length} STL files`;
  const totalSizeKb = files.reduce((sum, currentFile) => sum + currentFile.size, 0) / 1024;
  const postProcessingRates: Record<string, number> = {
    None: 0,
    Sanding: 3000,
    Polishing: 5000,
    Painting: 8000,
  };
  const recommendationItems = [
    "Use Red for strong visual impact on finished parts.",
    "Choose Yellow for prototypes that need quick visibility.",
    "Black is best for functional parts and better dust hiding.",
    "White is ideal for decorative and post-processed pieces.",
    "Select Sanding for a smoother finish without extra paint.",
  ];

  const calcQuote = useCallback(
    (
      fileList: File[],
      lh: number,
      inf: number,
      ql: number,
      q: number,
      postProc: string,
      mat: string = selectedMat,
      matPriceVal: number = matPrice,
      type: string = printType
    ) => {
      const baseWt = fileList.reduce((sum, currentFile) => {
        return sum + Math.max(14, (currentFile.size / 1024) * 0.11 * (inf / 30));
      }, 0);
      const wt = parseFloat((baseWt * ql).toFixed(1));
      const mins = Math.round(wt * (lh === 0.1 ? 4.5 : lh === 0.2 ? 2.8 : 1.8) * ql * q);
      const postProcessingCost = postProcessingRates[postProc] * q;
      const setupFee = 15000;
      const typeMultiplier = type === "SLS" ? 1.0 : 1.0;
      const matCostTotal = Math.round(wt * matPriceVal * 1000) * q * typeMultiplier;
      const total = matCostTotal + setupFee + postProcessingCost;
      const half = Math.round(total / 2);
      const readyDate = new Date(Date.now() + mins * 60000 + (postProc === "None" ? 0 : 30 * 60000));
      const readyAt = readyDate.toLocaleString("en-UG", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
      return {
        wt,
        hrs: Math.floor(mins / 60),
        rm: mins % 60,
        qty: q,
        total,
        half,
        bal: total - half,
        mat,
        lh,
        inf,
        postProcessing: postProc,
        postProcessingCost,
        printType: type,
        quality: ql.toString(),
        colour,
        readyAt,
      };
    },
    [matPrice, selectedMat, printType, postProcessingRates]
  );

  const runQuote = useCallback(
    (fileList: File[], lh = layer, inf = infill, ql = quality, q = qty, postProc = postProcessing, type = printType) => {
      setQuoteStatus("loading");
      onStepChange(2);
      setTimeout(() => {
        const result = calcQuote(fileList, parseFloat(lh), parseInt(inf), parseFloat(ql), q, postProc, selectedMat, matPrice, type);
        setQuote(result);
        setQuoteStatus("ready");
        onStepChange(3);
      }, 1600);
    },
    [calcQuote, layer, infill, quality, qty, postProcessing, printType, selectedMat, matPrice, onStepChange]
  );

  const handleFiles = (incomingFiles: File[]) => {
    const validFiles = incomingFiles.filter((currentFile) => currentFile.name.toLowerCase().endsWith(".stl"));
    if (validFiles.length === 0) return;

    setFiles(validFiles);
    onFilesChange?.(validFiles);
    onStepChange(2);
    runQuote(validFiles);
  };

  const reCalc = (lh = layer, inf = infill, ql = quality, q = qty, postProc = postProcessing, type = printType, mat = selectedMat, matPriceVal = matPrice) => {
    if (files.length === 0) return;
    setQuoteStatus("loading");
    onStepChange(2);
    setTimeout(() => {
      const result = calcQuote(files, parseFloat(lh), parseInt(inf), parseFloat(ql), q, postProc, mat, matPriceVal, type);
      setQuote(result);
      setQuoteStatus("ready");
      onStepChange(3);
    }, 1600);
  };

  const progSteps = ["Upload", "Configure", "Quote", "Pay & Slice"];
  const fieldIds = {
    material: "material-select",
    layer: "layer-height-select",
    infill: "infill-select",
    quality: "quality-select",
    quantity: "quantity-input",
    colour: "colour-select",
  };

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
        <div className="prog-steps">
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
                  <div className="connector" />
                )}
              </div>
            );
          })}
        </div>

        <div className="upload-layout">
          {/* Upload Card */}
          <div className="upload-card upload-card-compact" style={{ background: "var(--bg-surface)", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <UploadCloud size={18} strokeWidth={1.5} /> Upload STL
              </div>

              {/* Drop zone */}
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFiles(Array.from(e.dataTransfer.files));
                }}
                style={{
                  border: `2px dashed ${files.length > 0 ? "#22c55e" : dragOver ? "var(--brand-blue)" : "var(--bg-dim)"}`,
                  borderRadius: "var(--radius-md)", padding: "1.5rem 1.25rem",
                  textAlign: "center", cursor: "pointer",
                  background: dragOver ? "var(--bg-container-low)" : "transparent",
                  transition: "all 0.2s", marginBottom: files.length > 0 ? "1rem" : 0,
                }}
              >
                <input ref={inputRef} type="file" multiple accept=".stl" aria-label="Upload STL files" style={{ display: "none" }} onChange={(e) => { handleFiles(Array.from(e.target.files ?? [])); }} />
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem", color: files.length > 0 ? "#22c55e" : "var(--brand-blue)" }}>
                  <UploadCloud size={32} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.4rem" }}>
                  Drop your STL file{files.length > 1 ? "s" : ""} here
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>or click to browse multiple files</p>
                <div style={{ marginTop: "0.75rem", fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--brand-orange)" }}>
                  Accepted: .STL
                </div>
              </div>

              {/* File strip */}
              {files.length > 0 && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", background: "var(--bg-container-low)", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem" }}>
                  <FileText size={20} strokeWidth={1.5} style={{ color: "var(--brand-blue)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: "block", fontSize: "0.875rem", color: "var(--brand-blue)", fontWeight: 600 }}>{fileSummary}</strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontFamily: "var(--font-label)" }}>
                      {totalSizeKb.toFixed(1)} KB total · {files.length} STL{files.length > 1 ? "s" : ""}
                    </span>
                    {files.length > 1 && (
                      <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                        {files.map((currentFile) => (
                          <span key={currentFile.name + currentFile.size} style={{ fontSize: "0.72rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                            {currentFile.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <CheckCircle size={16} style={{ color: "#22c55e" }} />
                </div>
              )}
          </div>

          <div className="config-preview-row">
            {/* Config Card */}
            <div className="upload-config-card" style={{ background: "var(--bg-surface)", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Settings size={18} strokeWidth={1.5} /> Print Configuration
              </div>
              <div className="upload-config-grid">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", gridColumn: "1 / -1" }}>
                  <label style={LABEL_STYLE}>Print Type</label>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    {[
                      { id: "FDM", label: "FDM — Pearl Labs" },
                      { id: "SLS", label: "SLS — Lweera Electronics" },
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setPrintType(option.id as "FDM" | "SLS");
                          reCalc(undefined, undefined, undefined, undefined, undefined, option.id as "FDM" | "SLS");
                        }}
                        style={{
                          padding: "0.85rem 1rem",
                          borderRadius: "var(--radius-sm)",
                          border: `1.5px solid ${printType === option.id ? "var(--brand-blue)" : "var(--bg-container)"}`,
                          background: printType === option.id ? "var(--bg-container-low)" : "var(--bg-surface)",
                          color: printType === option.id ? "var(--brand-blue)" : "var(--text-primary)",
                          cursor: "pointer",
                          minWidth: 160,
                          textAlign: "left",
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                    {printType === "SLS"
                      ? "SLS orders are handled by Lweera Electronics and are scheduled with partner coordination."
                      : "FDM orders are printed in-house by Pearl Labs using PLA."}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gridColumn: "1 / -1", gap: "0.75rem" }}>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", color: "var(--text-primary)", fontWeight: 600 }}>
                    Need a recommendation?
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRecommendations((current) => !current)}
                    style={{
                      border: "1.5px solid var(--brand-blue)",
                      background: "transparent",
                      color: "var(--brand-blue)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.65rem 0.95rem",
                      cursor: "pointer",
                      fontFamily: "var(--font-label)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                    }}
                  >
                    {showRecommendations ? "Hide recommendations" : "Show recommendations"}
                  </button>
                </div>

                {showRecommendations && (
                  <div style={{ gridColumn: "1 / -1", padding: "1rem", background: "var(--bg-container-low)", border: "1px solid var(--bg-container)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                      {recommendationItems.map((item) => (
                        <li key={item} style={{ marginBottom: "0.5rem" }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", gridColumn: "1 / -1" }}>
                  <label htmlFor={fieldIds.material} style={LABEL_STYLE}>Material</label>
                  <select id={fieldIds.material} style={SELECT_STYLE} value={selectedMat} onChange={(e) => {
                    const material = MATERIALS.find(m => m.id === e.target.value);
                    if (material && material.available) {
                      onMatChange?.(material.id, material.pricePerGram);
                      if (files.length > 0) {
                        setTimeout(() => reCalc(layer, infill, quality, qty, postProcessing, printType, material.id, material.pricePerGram), 0);
                      }
                    }
                  }}>
                    {MATERIALS.map((m) => (
                      <option key={m.id} value={m.id} disabled={!m.available}>
                        {m.name}{!m.available ? " — Currently unavailable" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Layer height */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label htmlFor={fieldIds.layer} style={LABEL_STYLE}>Layer Height</label>
                  <select id={fieldIds.layer} style={SELECT_STYLE} value={layer} onChange={(e) => { setLayer(e.target.value); reCalc(e.target.value); }}>
                    <option value="0.1">0.1mm — Fine</option>
                    <option value="0.2">0.2mm — Standard</option>
                    <option value="0.3">0.3mm — Draft</option>
                  </select>
                </div>
                {/* Infill */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label htmlFor={fieldIds.infill} style={LABEL_STYLE}>Infill %</label>
                  <select id={fieldIds.infill} style={SELECT_STYLE} value={infill} onChange={(e) => { setInfill(e.target.value); reCalc(undefined, e.target.value); }}>
                    <option value="15">15% — Hollow</option>
                    <option value="30">30% — Standard</option>
                    <option value="50">50% — Strong</option>
                    <option value="80">80% — Solid</option>
                    <option value="100">100% — Full</option>
                  </select>
                </div>
                {/* Quality */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label htmlFor={fieldIds.quality} style={LABEL_STYLE}>Quality</label>
                  <select id={fieldIds.quality} style={SELECT_STYLE} value={quality} onChange={(e) => { setQuality(e.target.value); reCalc(undefined, undefined, e.target.value); }}>
                    <option value="1.0">Standard</option>
                    <option value="1.3">High Quality</option>
                    <option value="1.6">Ultra Quality</option>
                  </select>
                </div>
                {/* Qty */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label htmlFor={fieldIds.quantity} style={LABEL_STYLE}>Quantity</label>
                  <input id={fieldIds.quantity} type="number" min={1} max={100} value={qty} style={SELECT_STYLE}
                    onChange={(e) => { const v = Math.max(1, parseInt(e.target.value) || 1); setQty(v); reCalc(undefined, undefined, undefined, v); }} />
                </div>
                {/* Colour */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label htmlFor={fieldIds.colour} style={LABEL_STYLE}>Colour</label>
                  <select id={fieldIds.colour} style={SELECT_STYLE} value={colour} onChange={(e) => { setColour(e.target.value); reCalc(undefined, undefined, undefined, undefined, undefined); }}>
                    {['White','Black','Red','Yellow'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {/* Post-processing */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", gridColumn: "1 / -1" }}>
                  <label htmlFor="postprocessing-select" style={LABEL_STYLE}>Post-processing</label>
                  <select id="postprocessing-select" style={SELECT_STYLE} value={postProcessing} onChange={(e) => { setPostProcessing(e.target.value); reCalc(undefined, undefined, undefined, undefined, e.target.value); }}>
                    <option value="None">None</option>
                    <option value="Sanding">Sanding (+UGX 3,000 per item)</option>
                    <option value="Polishing">Polishing (+UGX 5,000 per item)</option>
                    <option value="Painting">Painting (+UGX 8,000 per item)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="preview-card" style={{ background: "var(--bg-surface)", border: "1.5px solid var(--bg-container)", boxShadow: "var(--shadow-sm)" }}>
              <PreviewGallery
                files={files}
                color={colour}
                material={selectedMat}
                layerHeight={parseFloat(layer)}
                infill={parseInt(infill)}
                quality={parseFloat(quality)}
                quantity={qty}
              />
            </div>
          </div>

          <div className="quote-row">
            <QuotePanel
              status={quoteStatus}
              quote={quote}
              orderPlaced={orderPlaced}
              onPay={() => { if (quote && files.length > 0) onPayOpen(quote, fileSummary); }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
