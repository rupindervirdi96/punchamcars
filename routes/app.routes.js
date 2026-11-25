const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { sendDreamCarEmail } = require("../services/mail");
const cfg = require("../config/default.json");

/* ── Noloco GraphQL payload ──────────────────────────────────── */
const NOLOCO_URL = `https://api.portals.noloco.io/data/${cfg.nolocoProject}`;
const NOLOCO_QUERY = `query carmojiVehiclesCollection {
  carmojiVehiclesCollection(
    where: {OR: [{status: {notIn: ["DELIVERED"]}}]}
    sort: [{field: "createdAt", direction: ASC}]
    first: 3000
  ) {
    edges {
      node {
        id
        uuid
        make
        model
        year
        status
        googleDriveFolder
        googlePhotosAlbumIdVal
      }
    }
  }
}`;
const AIRTABLE_IMAGES_URL = `https://api.airtable.com/v0/${cfg.airtableBaseId}/Vehicle%20Images`;

const CarSchema = new mongoose.Schema({
  Brand: {
    type: String,
    required: true,
  },
  Model: {
    type: String,
    required: true,
  },
  Year: {
    type: Number,
    required: true,
  },
  Mileage: {
    type: Number,
    required: true,
  },
  BodyType: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Photos: [String],
});

const ClientSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  BiweeklyBudget: {
    type: Number,
  },
  PreferredYearRange: {
    type: String,
  },
  CreditScore: {
    type: Number,
  },
  AdditionalDetails: {
    type: String,
  },
});

const Car = mongoose.model("car", CarSchema);

router.get("/cars", async (req, res) => {
  const cars = await Car.find();
  res.send(cars);
});

router.post("/dreamcar", async (req, res) => {
  // Wait for Resend to accept the email before telling the customer it worked,
  // so a failed send shows an error in the form instead of being lost silently.
  try {
    const submission = req.body || {};
    const { data, error } = await sendDreamCarEmail(submission);

    if (error) {
      console.error("Dream car email rejected by Resend:", error);
      return res.status(502).json({ ok: false, error: "email_failed" });
    }

    console.log("Dream car email sent:", data && data.id);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Dream car email failed:", error);
    return res.status(500).json({ ok: false, error: "email_failed" });
  }
});


/* ── GET /api/noloco/vehicles ────────────────────────────────── */
router.get("/noloco/vehicles", async (req, res) => {
  try {
    const response = await fetch(NOLOCO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NOLOCO_TOKEN}`,
        "X-Noloco-Ghost": "false",
        "X-Noloco-Project": cfg.nolocoProject,
      },
      body: JSON.stringify([{
        operationName: "carmojiVehiclesCollection",
        variables: {
          sort: [{ field: "createdAt", direction: "ASC" }],
          first: 3000,
          where: [{ operator: "OR", branches: [{ filters: [{ field: "status", operator: "NOT_IN", result: "DELIVERED" }] }] }],
        },
        query: NOLOCO_QUERY,
      }]),
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Noloco upstream error: ${response.status}` });
    }

    const data = await response.json();

    // Surface GraphQL-level errors (e.g. expired auth token)
    const gqlErrors = data[0]?.errors;
    if (gqlErrors?.length) {
      const msg = gqlErrors[0]?.message || "Unknown Noloco error";
      console.error("Noloco GraphQL error:", msg);
      return res.status(502).json({ error: `Noloco error: ${msg}` });
    }

    const edges = data[0]?.data?.carmojiVehiclesCollection?.edges || [];
    res.json(edges.map((e) => e.node));
  } catch (err) {
    console.error("Noloco proxy error:", err.message);
    res.status(500).json({ error: "Failed to fetch vehicle inventory." });
  }
});

/* ── GET /api/drive/photos/:folderId ─────────────────────────── */
router.get("/drive/photos/:folderId", async (req, res) => {
  const { folderId } = req.params;

  // Validate folderId to prevent injection into query string
  if (!/^[a-zA-Z0-9_\-]{10,}$/.test(folderId)) {
    return res.status(400).json({ error: "Invalid folder ID." });
  }

  try {
    const q = encodeURIComponent(`'${folderId}' in parents and mimeType contains 'image/'`);
    const fields = encodeURIComponent("files(id,name,mimeType)");
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&orderBy=name&key=${process.env.GOOGLE_DRIVE_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(502).json({ error: `Google Drive API error: ${response.status}` });
    }

    const data = await response.json();
    const photos = (data.files || [])
      .filter((f) => f.mimeType?.startsWith("image/"))
      .map((f) => `https://drive.google.com/thumbnail?sz=w800&id=${f.id}`);

    res.json(photos);
  } catch (err) {
    console.error("Drive proxy error:", err.message);
    res.status(500).json({ error: "Failed to fetch vehicle photos." });
  }
});

module.exports = router;
