import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Enquiry from "./models/Enquiry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 10000;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      const isAllowed =
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        (typeof origin === "string" && origin.endsWith(".vercel.app"));

      if (isAllowed) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin is not allowed by CORS."));
    },
  })
);

app.use(express.json({ limit: "25kb" }));

// MongoDB Connection
const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  console.error("MONGODB_URI environment variable is not set.");
  process.exit(1);
}

mongoose
  .connect(mongodbUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

const frontendPath = path.resolve(__dirname, "..", "dist");

const cleanText = (value) => (typeof value === "string" ? value.trim() : "");

// Health check endpoint
app.get("/api/health", (_request, response) => {
  const mongoConnected = mongoose.connection.readyState === 1;
  response.json({
    ok: true,
    service: "vohra-ca-api",
    mongodbConnected: mongoConnected,
  });
});

// Get all enquiries (for dashboard)
app.get("/api/enquiries", async (_request, response) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    response.json({
      ok: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    response.status(500).json({
      ok: false,
      message: "Could not fetch enquiries",
    });
  }
});

// Create new enquiry
app.post("/api/enquiries", async (request, response) => {
  try {
    const enquiry = {
      full_name: cleanText(request.body.fullName),
      email: cleanText(request.body.email).toLowerCase(),
      phone: cleanText(request.body.phone),
      service: cleanText(request.body.service),
      message: cleanText(request.body.message),
      source_page: "react-contact-form",
    };

    // Validate required fields
    const requiredFields = ["full_name", "email", "phone", "service", "message"];
    const missingField = requiredFields.find((field) => !enquiry[field]);

    if (missingField) {
      response.status(400).json({
        ok: false,
        message: "Please fill all required fields.",
      });
      return;
    }

    // Create and save enquiry
    const newEnquiry = new Enquiry(enquiry);
    await newEnquiry.save();

    response.status(201).json({
      ok: true,
      message: "Enquiry saved successfully.",
      data: newEnquiry,
    });
  } catch (error) {
    console.error("Error saving enquiry:", error);
    response.status(500).json({
      ok: false,
      message: "Could not save enquiry. Please try again.",
      detail: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
});

// Update enquiry status (for admin dashboard)
app.put("/api/enquiries/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const { status } = request.body;

    if (!["new", "contacted", "resolved"].includes(status)) {
      response.status(400).json({
        ok: false,
        message: "Invalid status value.",
      });
      return;
    }

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedEnquiry) {
      response.status(404).json({
        ok: false,
        message: "Enquiry not found.",
      });
      return;
    }

    response.json({
      ok: true,
      message: "Enquiry updated successfully.",
      data: updatedEnquiry,
    });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    response.status(500).json({
      ok: false,
      message: "Could not update enquiry.",
    });
  }
});

// Delete enquiry
app.delete("/api/enquiries/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);

    if (!deletedEnquiry) {
      response.status(404).json({
        ok: false,
        message: "Enquiry not found.",
      });
      return;
    }

    response.json({
      ok: true,
      message: "Enquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    response.status(500).json({
      ok: false,
      message: "Could not delete enquiry.",
    });
  }
});

// Serve frontend build files conditionally if they exist
const hasFrontendBuild = fs.existsSync(path.join(frontendPath, "index.html"));

if (hasFrontendBuild) {
  app.use(express.static(frontendPath));

  app.get("*", (request, response, next) => {
    if (request.path.startsWith("/api/")) {
      return next();
    }
    response.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  // Fallback for root route in API-only mode
  app.get("/", (_request, response) => {
    response.json({
      ok: true,
      service: "vohra-ca-api",
      message: "Vohra CA API is running. Frontend is deployed separately (e.g. Vercel).",
    });
  });
}

// 404 handler for API routes
app.use((request, response) => {
  if (request.path.startsWith("/api/")) {
    return response.status(404).json({
      ok: false,
      message: "Not found",
    });
  }
  
  if (hasFrontendBuild) {
    response.status(404).sendFile(path.join(frontendPath, "index.html"));
  } else {
    response.status(404).json({
      ok: false,
      message: "Resource not found",
    });
  }
});

app.listen(port, () => {
  console.log(`Vohra CA API running on port ${port}`);
});
