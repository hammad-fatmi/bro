import { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFile = (file) => {
    setFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploadedUrl(res.data.imageUrl);
      alert("Upload successful 🚀");
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "sans-serif",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        color: "white"
      }}
    >
      <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>
        📤 Upload Center
      </h2>

      <p style={{ opacity: 0.8 }}>
        Drag & drop your image or video and upload to cloud ☁️
      </p>

      {/* DROP AREA */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("fileInput").click()}
        style={{
          border: "2px dashed #ffffff80",
          borderRadius: "15px",
          padding: "60px",
          textAlign: "center",
          cursor: "pointer",
          marginTop: "30px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)"
        }}
      >
        <p style={{ fontSize: "18px" }}>📁 Drag & Drop file here</p>
        <p style={{ opacity: 0.7 }}>or click to select</p>

        <input
          id="fileInput"
          type="file"
          accept="image/*,video/*"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {/* PREVIEW */}
      {preview && (
        <div style={{ marginTop: "30px" }}>
          <h3>Preview:</h3>

          {file.type.startsWith("image") ? (
            <img
              src={preview}
              width="300"
              style={{ borderRadius: "12px", marginTop: "10px" }}
            />
          ) : (
            <video
              src={preview}
              controls
              width="400"
              style={{ borderRadius: "12px", marginTop: "10px" }}
            />
          )}
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        style={{
          marginTop: "30px",
          padding: "12px 25px",
          cursor: "pointer",
          border: "none",
          borderRadius: "10px",
          background: "linear-gradient(90deg, #ff6a00, #ee0979)",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px"
        }}
      >
        🚀 Upload to S3
      </button>

      {/* RESULT */}
      {uploadedUrl && (
        <div style={{ marginTop: "30px" }}>
          <h3>✅ Uploaded Successfully</h3>

          <a
            href={uploadedUrl}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#00ffd5" }}
          >
            View File
          </a>
        </div>
      )}
    </div>
  );
}