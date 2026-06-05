"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Layers } from "lucide-react";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newMat, setNewMat] = useState({ name: "", description: "", pricePerGram: 0, colours: "Red,Yellow,Black,White", inStock: true });

  const handleUpdateMaterial = (id: string, field: string, value: string | boolean | number) => {
    setMaterials(materials.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleSave = (id: string) => {
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  useEffect(() => {
    let mounted = true;
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/materials");
        if (!res.ok) throw new Error("Failed to fetch materials");
        const data = await res.json();
        if (mounted) setMaterials(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchMaterials();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddMaterial = async () => {
    try {
      const payload = {
        name: newMat.name,
        description: newMat.description,
        pricePerGram: Number(newMat.pricePerGram) || 0,
        colours: newMat.colours,
        inStock: Boolean(newMat.inStock),
      };
      const res = await fetch("/api/materials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed to create material");
      const created = await res.json();
      setMaterials((prev) => [created, ...prev]);
      setNewMat({ name: "", description: "", pricePerGram: 0, colours: "Red,Yellow,Black,White", inStock: true });
      setAdding(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add material. Check server logs.");
    }
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "2rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <Layers size={24} /> Materials
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Manage available materials, prices, and colours</p>
      </div>

      {/* Materials Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        {loading ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--text-secondary)" }}>Loading materials…</div>
        ) : materials.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--text-secondary)" }}>No materials yet.</div>
        ) : (
          materials.map((material) => (
            <div key={material.id} style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <input
                type="text"
                value={material.name}
                onChange={(e) => handleUpdateMaterial(material.id, "name", e.target.value)}
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--brand-blue)",
                  border: "1px solid transparent",
                  background: "transparent",
                  outline: "none",
                  cursor: "text",
                  padding: "0.25rem 0",
                  minWidth: 0,
                  flex: 1,
                }}
              />
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-label)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={material.inStock}
                  onChange={(e) => handleUpdateMaterial(material.id, "inStock", e.target.checked)}
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                />
                In Stock
              </label>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Description
              </label>
              <textarea
                value={material.description}
                onChange={(e) => handleUpdateMaterial(material.id, "description", e.target.value)}
                style={{
                  width: "100%",
                  minHeight: 80,
                  padding: "0.65rem 0.75rem",
                  border: "1.5px solid var(--bg-container)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  background: "var(--bg-surface)",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Price */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Price per Gram (UGX)
              </label>
              <input
                type="number"
                value={material.pricePerGram}
                onChange={(e) => handleUpdateMaterial(material.id, "pricePerGram", parseFloat(e.target.value) || 0)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.75rem",
                  border: "1.5px solid var(--bg-container)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-label)",
                  fontSize: "0.95rem",
                  color: "var(--text-primary)",
                  background: "var(--bg-surface)",
                  outline: "none",
                }}
                step="0.1"
              />
            </div>

            {/* Colours */}
              <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                Available Colours
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(Array.isArray(material.colours) ? material.colours : (material.colours || "").split(",")).map((colour: string) => (
                  <span
                    key={colour}
                    style={{
                      display: "inline-block",
                      padding: "0.4rem 0.85rem",
                      background: "var(--bg-container-low)",
                      border: "1px solid var(--bg-container)",
                      borderRadius: "9999px",
                      fontFamily: "var(--font-label)",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {colour.trim()}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>Note: Colour management coming soon</p>
            </div>

            {/* Save Button */}
            <button
              onClick={() => handleSave(material.id)}
              style={{
                width: "100%",
                padding: "0.7rem",
                background: saved === material.id ? "#16a34a" : "var(--brand-orange)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-label)",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "background 0.2s ease",
              }}
            >
              <Save size={16} /> {saved === material.id ? "Saved!" : "Save Material"}
            </button>
          </div>
        )))}
      </div>

      {/* Add New Material Button */}
      <div style={{ background: "#fff", border: "2px dashed var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "2rem", color: "var(--text-secondary)" }}>
        {!adding ? (
          <>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>➕</div>
            <p style={{ fontFamily: "var(--font-label)", fontSize: "0.95rem", marginBottom: "1rem" }}>Add a new material to your inventory</p>
            <button
              onClick={() => setAdding(true)}
              style={{ padding: "0.7rem 1.5rem", background: "var(--brand-orange)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Plus size={16} /> Add Material
            </button>
          </>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem", maxWidth: 720, margin: "0 auto" }}>
            <input placeholder="Material name" value={newMat.name} onChange={(e) => setNewMat({ ...newMat, name: e.target.value })} style={{ padding: "0.6rem", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-sm)" }} />
            <textarea placeholder="Description" value={newMat.description} onChange={(e) => setNewMat({ ...newMat, description: e.target.value })} style={{ padding: "0.6rem", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-sm)" }} />
            <input type="number" placeholder="Price per gram" value={newMat.pricePerGram} onChange={(e) => setNewMat({ ...newMat, pricePerGram: Number(e.target.value) })} style={{ padding: "0.6rem", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-sm)" }} />
            <input placeholder="Colours (comma separated)" value={newMat.colours} onChange={(e) => setNewMat({ ...newMat, colours: e.target.value })} style={{ padding: "0.6rem", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-sm)" }} />
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><input type="checkbox" checked={newMat.inStock} onChange={(e) => setNewMat({ ...newMat, inStock: e.target.checked })} /> In stock</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleAddMaterial} style={{ padding: "0.6rem 1rem", background: "var(--brand-orange)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)" }}>
                Create
              </button>
              <button onClick={() => setAdding(false)} style={{ padding: "0.6rem 1rem", background: "var(--bg-container)", color: "var(--text-secondary)", border: "none", borderRadius: "var(--radius-sm)" }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}