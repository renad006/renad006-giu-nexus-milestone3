// src/components/SkillChip.jsx
const SkillChip = ({ skill }) => {
    return (
    <span style={{
        display: "inline-block",
        backgroundColor: "#F9EAD2",
        color: "#4F5127",
        borderRadius: "999px",
        padding: "4px 12px",
        fontSize: "0.8rem",
        margin: "4px",
        fontWeight: 500,
        border: "1px solid #837534",
    }}>
        {skill}
    </span>
    ) ;
};

export default SkillChip;