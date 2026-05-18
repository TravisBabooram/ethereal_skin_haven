"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface Props {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
}

export default function CloudinaryUpload({ value, onChange, folder = "ethereal-skin-haven" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Image must be under 10 MB."); return; }

    setUploading(true);
    setError("");

    try {
      const sigRes = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ folder }),
      });
      if (!sigRes.ok) {
        const d = await sigRes.json();
        throw new Error(d.error || "Failed to get upload credentials");
      }
      const { cloudName, apiKey, timestamp, signature } = await sigRes.json();

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      form.append("folder", folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: form,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const data = await uploadRes.json();
      onChange(data.secure_url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />

      {value ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)", display: "block" }} />
          <button type="button" onClick={() => onChange("")}
            style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%", background: "#e05555", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <X size={12} />
          </button>
          <button type="button" onClick={() => inputRef.current?.click()}
            style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "none", border: "1px solid var(--border)", borderRadius: 2, cursor: "pointer", color: "var(--text-muted)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", transition: "all 0.2s" }}>
            <Upload size={11} /> Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", minHeight: 120,
            background: dragging ? "rgba(201,169,110,0.07)" : "var(--bg-elevated)",
            border: `2px dashed ${error ? "#e05555" : dragging ? "var(--gold)" : "var(--border)"}`,
            borderRadius: 6, cursor: uploading ? "not-allowed" : "pointer",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={e => { if (!uploading && !dragging) e.currentTarget.style.borderColor = "var(--gold)"; }}
          onMouseLeave={e => { if (!uploading && !dragging) e.currentTarget.style.borderColor = error ? "#e05555" : "var(--border)"; }}>
          {uploading
            ? <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "var(--gold)" }} />
            : <ImageIcon size={20} style={{ color: dragging ? "var(--gold)" : "var(--text-subtle)" }} />}
          <span style={{ fontSize: 10, letterSpacing: "0.15em", color: dragging ? "var(--gold)" : "var(--text-subtle)", textTransform: "uppercase" }}>
            {uploading ? "Uploading…" : dragging ? "Drop to upload" : "Click or drag & drop"}
          </span>
          {!uploading && !dragging && (
            <span style={{ fontSize: 10, color: "var(--text-subtle)", opacity: 0.6 }}>JPG, PNG, WEBP · max 10 MB</span>
          )}
        </button>
      )}
      {error && <p style={{ fontSize: 11, color: "#e05555", margin: "6px 0 0" }}>{error}</p>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
