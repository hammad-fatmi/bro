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
      alert("Upload successful");
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h2>Upload Image / Video</h2>

      {/* DROP AREA */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("fileInput").click()}
        style={{
          border: "2px dashed #999",
          borderRadius: "12px",
          padding: "50px",
          textAlign: "center",
          cursor: "pointer",
          marginTop: "20px"
        }}
      >
        <p>Drag & Drop file here</p>
        <p>or click to select</p>

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
        <div style={{ marginTop: "20px" }}>
          {file.type.startsWith("image") ? (
            <img src={preview} width="300" />
          ) : (
            <video src={preview} controls width="400" />
          )}
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        Upload
      </button>

      {/* RESULT */}
      {uploadedUrl && (
        <div style={{ marginTop: "20px" }}>
          <a href={uploadedUrl} target="_blank">
            View Uploaded File
          </a>
        </div>
      )}
    </div>
  );
}