import express from "express";
import fetch from "node-fetch";
import { parse } from "csv-parse/sync";
import PImage from "pureimage";

const app = express();
const SHEET_URL = process.env.SHEET_URL;

app.get("/sheet.png", async (req, res) => {
  try {
    const csvText = await (await fetch(SHEET_URL)).text();
    const records = parse(csvText);

    const rowHeight = 40;
    const colWidth = 300;
    const rows = records.length;
    const cols = records[0].length;

    const img = PImage.make(cols * colWidth, rows * rowHeight);
    const ctx = img.getContext("2d");

    // Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, img.width, img.height);

    // Text
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillText(records[r][c], c * colWidth + 10, r * rowHeight + 25);
      }
    }

    res.setHeader("Content-Type", "image/png");
    PImage.encodePNGToStream(img, res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating image");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running"));
