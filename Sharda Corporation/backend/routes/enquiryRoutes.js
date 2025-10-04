import express from "express";
import Enquiry from "../models/enquiryModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(201).json(enquiry);
});

export default router;
