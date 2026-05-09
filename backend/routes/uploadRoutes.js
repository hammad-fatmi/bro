import express from "express";
import upload from "../middleware/upload.js";
import { uploadImage } from "../controller/uploadController.js";

const router = express.Router();

router.post("/", upload.single("image"), uploadImage);

export default router;