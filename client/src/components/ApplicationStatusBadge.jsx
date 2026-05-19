const ApplicationStatusBadge = ({ status }) => {
  const styles = {
    pending: { backgroundColor: '#F8EEC2', color: '#837534' },
    shortlisted: { backgroundColor: '#4F5127', color: '#F9EAD2' },
    rejected: { backgroundColor: '#DB918F', color: '#4F5127' },
  };

  return (
    <span style={{
      display: 'inline-block',
      borderRadius: '999px',
      padding: '4px 12px',
      fontSize: '13px',
      fontWeight: '600',
      ...styles[status] || styles.pending,
    }}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export default ApplicationStatusBadge;