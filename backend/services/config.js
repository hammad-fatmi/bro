const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "";

export default API_BASE;