// src/components/CoverLetterGenerator.jsx
import { useState } from "react";
import api from "../services/api";

const CoverLetterGenerator = ({ jobId }) => {
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/jobs/${jobId}/cover-letter`);
      setLetter(res.data.coverLetter);
    } catch {
      setError("Could not generate cover letter. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: "#0f0f0f",
      border: "1px solid #837534",
      borderRadius: 16,
      padding: "32px 36px",
      maxWidth: 620,
      boxShadow: "0 8px 32px rgba(131, 117, 52, 0.15)",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>✨</div>
        <h3 style={{
          color: "#F9EAD2",
          margin: "0 0 6px 0",
          fontSize: "1.4rem",
          fontFamily: "Georgia, serif",
          letterSpacing: "0.5px",
        }}>
          Cover Letter Suggestion
        </h3>
        <p style={{
          color: "#837534",
          margin: 0,
          fontSize: "0.82rem",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
        }}>
          AI-generated based on your bio
        </p>
      </div>

      {/* Divider */}
      <div style={{
        borderTop: "1px solid #837534",
        marginBottom: 24,
        opacity: 0.3,
      }} />

      {/* Button */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#4F5127" : "#DB918F",
            color: loading ? "#F8EEC2" : "#4F5127",
            border: "none",
            borderRadius: "999px",
            padding: "12px 32px",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "0.95rem",
            letterSpacing: "0.5px",
            fontFamily: "Georgia, serif",
            boxShadow: loading ? "none" : "0 4px 16px rgba(219, 145, 143, 0.3)",
          }}
        >
          {loading ? "⏳ Generating..." : "✨ Generate Cover Letter"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          backgroundColor: "#1a1a1a",
          border: "1px solid #DB918F",
          borderRadius: 10,
          padding: "14px 18px",
          textAlign: "center",
          marginBottom: 16,
        }}>
          <p style={{
            color: "#DB918F",
            margin: 0,
            fontSize: "0.85rem",
            fontFamily: "Georgia, serif",
          }}>
            {error}
          </p>
        </div>
      )}

      {/* Result */}
      {letter && (
        <div>
          <div style={{
            borderTop: "1px solid #837534",
            marginBottom: 16,
            opacity: 0.3,
          }} />
          <p style={{
            color: "#837534",
            margin: "0 0 10px 0",
            fontSize: "0.78rem",
            letterSpacing: "1px",
            textTransform: "uppercase",
            textAlign: "center",
          }}>
            Edit before sending
          </p>
          <textarea
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            rows={10}
            style={{
              width: "100%",
              backgroundColor: "#1a1a1a",
              color: "#F9EAD2",
              border: "1px solid #837534",
              borderRadius: 10,
              padding: 16,
              fontSize: "0.88rem",
              lineHeight: 1.7,
              resize: "vertical",
              boxSizing: "border-box",
              fontFamily: "Georgia, serif",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CoverLetterGenerator;