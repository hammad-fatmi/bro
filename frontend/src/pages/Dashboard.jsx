export default function Dashboard() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 Deployment Dashboard</h1>
        <p style={styles.text}>
          If you can see this page, your routing + CI/CD is working perfectly.
        </p>

        <div style={styles.grid}>
          <div style={styles.box}>
            <h3>✔ Backend</h3>
            <p>Running successfully</p>
          </div>

          <div style={styles.box}>
            <h3>✔ Frontend</h3>
            <p>React routing active</p>
          </div>

          <div style={styles.box}>
            <h3>✔ Docker</h3>
            <p>Containers healthy</p>
          </div>

          <div style={styles.box}>
            <h3>✔ CI/CD</h3>
            <p>Auto deploy working</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
    padding: "20px"
  },
  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    width: "80%",
    maxWidth: "800px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
  },
  title: {
    fontSize: "28px",
    marginBottom: "10px"
  },
  text: {
    marginBottom: "20px",
    color: "#cbd5e1"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px"
  },
  box: {
    background: "#334155",
    padding: "15px",
    borderRadius: "10px"
  }
};