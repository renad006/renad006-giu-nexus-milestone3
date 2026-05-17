// src/utils/categoryColors.js
// Single source of truth for category badge colours.
// Import this file EVERYWHERE a category badge appears.

export const CATEGORY_COLORS = {
  "Frontend":         { background: "#DB918F", color: "#4F5127" }, // Juicy Peach
  "Backend":          { background: "#837534", color: "#F9EAD2" }, // Spanish Bistre
  "AI/ML":            { background: "#4F5127", color: "#F8EEC2" }, // Codium Fragile
  "DevOps":           { background: "#F8EEC2", color: "#837534" }, // Champagne Tickle
  "Data Engineering": { background: "#F9EAD2", color: "#4F5127" }, // Antique Ivory
  "Other":            { background: "#837534", color: "#F9EAD2" }, // Spanish Bistre muted
};

export const getCategoryStyle = (category) => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS["Other"];
};