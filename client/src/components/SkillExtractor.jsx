// src/components/SkillExtractor.jsx
import { useState } from "react";
import api from "../services/api";
import SkillChip from "./SkillChip";

const SkillExtractor = ({ initialSkills }) => {
  const [skills, setSkills] = useState(initialSkills || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExtract = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/profile/extract-skills");
      setSkills(res.data.skills);
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Your bio is empty. Please update your profile first.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      padding: "40px 16px",
    }}>
      <div style={{
        backgroundColor: "#0f0f0f",
        border: "1px solid #837534",
        borderRadius: 16,
        padding: "32px 36px",
        width: "100%",
        maxWidth: 580,
        boxShadow: "0 8px 32px rgba(131, 117, 52, 0.15)",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}></div>
          <h3 style={{
            color: "#F9EAD2",
            margin: "0 0 6px 0",
            fontSize: "1.4rem",
            fontFamily: "Georgia, serif",
            letterSpacing: "0.5px",
          }}>
            Your Skills
          </h3>
          <p style={{
            color: "#837534",
            margin: 0,
            fontSize: "0.82rem",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}>
            AI-extracted from your bio
          </p>
        </div>

        {/* Divider */}
        <div style={{
          borderTop: "1px solid #837534",
          marginBottom: 24,
          opacity: 0.3,
        }} />

        {/* Chips */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
          minHeight: 48,
          marginBottom: 28,
        }}>
          {skills.length > 0
            ? skills.map((skill, i) => <SkillChip key={i} skill={skill} />)
            : <p style={{
                color: "#837534",
                margin: 0,
                fontSize: "0.85rem",
                fontStyle: "italic",
                textAlign: "center",
              }}>
                No skills yet — extract them from your bio below.
              </p>
          }
        </div>

        {/* Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleExtract}
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
              transition: "all 0.2s",
            }}
          >
            {loading ? "⏳ Extracting..." : "Extract Skills from Bio"}
          </button>
        </div>

        {/* Inline error */}
        {error && (
          <div style={{
            marginTop: 20,
            backgroundColor: "#1a1a1a",
            border: "1px solid #DB918F",
            borderRadius: 10,
            padding: "14px 18px",
            textAlign: "center",
          }}>
            <p style={{
              color: "#DB918F",
              margin: "0 0 6px 0",
              fontSize: "0.85rem",
              fontFamily: "Georgia, serif",
            }}>
              {error}
            </p>
            <a href="/profile/edit" style={{
              color: "#F8EEC2",
              fontSize: "0.8rem",
              letterSpacing: "0.5px",
            }}>
              Edit your profile →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillExtractor;