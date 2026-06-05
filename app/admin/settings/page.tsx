"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [siteName, setSiteName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [currency, setCurrency] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (!response.ok) {
          throw new Error("Failed to load settings");
        }
        const data = await response.json();
        setSettings(data);
        setSiteName(data.siteName || "");
        setContactEmail(data.contactEmail || "");
        setSupportPhone(data.supportPhone || "");
        setCurrency(data.currency || "UGX");
      } catch (err) {
        console.error(err);
        setError("Unable to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteName, contactEmail, supportPhone, currency }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const updated = await response.json();
      setSettings(updated);
      setSuccess(true);
      window.setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
        Loading settings…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#dc2626" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "2rem", fontWeight: 700, color: "var(--brand-blue)", marginBottom: "0.5rem" }}>
          ⚙️ Settings
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Manage store configuration and contact details.</p>
      </div>

      <div style={{ background: "#fff", border: "1.5px solid var(--bg-container)", borderRadius: "var(--radius-lg)", padding: "2rem", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              Site Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              style={{
                width: "100%",
                padding: "0.9rem 1rem",
                border: "1.5px solid var(--bg-container)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.9rem 1rem",
                  border: "1.5px solid var(--bg-container)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                Support Phone
              </label>
              <input
                type="tel"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.9rem 1rem",
                  border: "1.5px solid var(--bg-container)",
                  borderRadius: "var(--radius-sm)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "var(--font-label)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
              Currency
            </label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                width: "100%",
                padding: "0.9rem 1rem",
                border: "1.5px solid var(--bg-container)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <div>
              {success && (
                <div style={{ color: "#16a34a", fontWeight: 600 }}>Settings saved successfully.</div>
              )}
              {error && !loading && (
                <div style={{ color: "#dc2626", fontWeight: 600 }}>{error}</div>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "0.9rem 1.25rem",
                background: "var(--brand-orange)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-label)",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
