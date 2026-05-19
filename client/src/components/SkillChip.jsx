const SkillChip = ({ skill }) => {
  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: '#F8EEC2',
      color: '#4F5127',
      borderRadius: '999px',
      padding: '4px 12px',
      fontSize: '13px',
      fontWeight: '600',
      margin: '4px',
      border: '1px solid #837534',
    }}>
      {skill}
    </span>
  );
};

export default SkillChip;