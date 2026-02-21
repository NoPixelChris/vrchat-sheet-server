import express from "express";
import fetch from "node-fetch";
import { createCanvas } from "canvas";
import { parse } from "csv-parse/sync";

const app = express();

const SHEET_URL = process.env.SHEET_URL; // we set this on Railway

app.get("/sheet.png", async (req, res) => {
  try {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();

    const records = parse(csvText);

    const rowHeight = 40;
    const colWidth = 300;

    const rows = records.length;
    const cols = records[0].length;

    const canvas = createCanvas(cols * colWidth, rows * rowHeight);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillText(records[r][c], c * colWidth + 10, r * rowHeight + 25);
      }
    }

    res.setHeader("Content-Type", "image/png");
    canvas.createPNGStream().pipe(res);

  } catch (err) {
    res.status(500).send("Error generating image");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running"));