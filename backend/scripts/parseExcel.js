import XLSX from "xlsx";
import fs from "fs";
import dotenv from "dotenv";

// Clean category name globally
function cleanCategory(name) {
  if (name.trim() === "SMI 8_9_10") return "Mini Presentation Items";
  return name.replace(/[_\s]*\d+$/, "").trim();
}

// Detect product name row → exactly 1 non-empty cell
function isProductNameRow(row) {
  const nonEmpty = row.filter((v) => v && v.trim() !== "");
  return nonEmpty.length === 1;
}

// Detect header row → the row AFTER product name
function isHeaderRowAfterProductName(row) {
  const nonEmpty = row.filter((v) => v && v.trim() !== "");
  return nonEmpty.length >= 2; // must contain multiple headings
}

function parseSheet(sheetName, sheet) {
  const cleanedCategory = cleanCategory(sheetName);
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  let currentProduct = null;
  let header = null;
  const products = [];
  let state = "LOOKING_FOR_PRODUCT";

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME; // change this
  const cloudinaryBase = `https://res.cloudinary.com/${cloudName}/image/upload/sharda/variants/`;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].map((c) => String(c || "").trim());
    const nonEmpty = row.filter((x) => x !== "");

    if (nonEmpty.length === 0) continue;

    // STEP 1: PRODUCT NAME
    if (state === "LOOKING_FOR_PRODUCT" && isProductNameRow(row)) {
      currentProduct = {
        name: nonEmpty[0],
        category: cleanedCategory,
        variants: [],
        imageUrl: "",
        description: "",
      };
      products.push(currentProduct);
      state = "LOOKING_FOR_HEADER";
      continue;
    }

    // STEP 2: HEADER ROW
    if (state === "LOOKING_FOR_HEADER" && isHeaderRowAfterProductName(row)) {
      header = row; // Exact Excel header names
      state = "READING_VARIANTS";
      continue;
    }

    // STEP 3: VARIANT ROWS
    if (state === "READING_VARIANTS") {
      // If new product starts
      if (isProductNameRow(row)) {
        currentProduct = {
          name: nonEmpty[0],
          category: cleanedCategory,
          variants: [],
          imageUrl: "",
          description: "",
        };
        products.push(currentProduct);
        header = null;
        state = "LOOKING_FOR_HEADER";
        continue;
      }

      if (!header) continue;

      // Create variant row
      const variantObj = {};
      header.forEach((h, idx) => {
        variantObj[h] = row[idx] || "";
      });

      // Skip empty rows
      const meaningful = Object.values(variantObj).some(
        (v) => v && v.trim() !== "" && v !== "-"
      );
      if (!meaningful) continue;

      // 🔥 FIND CODE COLUMN
      let codeValue = null;
      for (const key of Object.keys(variantObj)) {
        if (key.toLowerCase().includes("code")) {
          codeValue = variantObj[key];
          break;
        }
      }

      // 🔥 ADD VARIANT IMAGE URL (if code exists)
      if (codeValue) {
        variantObj.imageUrl = "";

      } else {
        variantObj.imageUrl = ""; // no code found
      }

      // Push variant
      currentProduct.variants.push({ data: variantObj });
    }
  }

  return products;
}

function main() {
  const excelPath = process.argv[2];
  const outputPath = process.argv[3] || "products_cleaned.json";

  if (!excelPath) {
    console.error("❌ Usage: node parseExcel.js <excel-file-path> <output-json>");
    process.exit(1);
  }

  const workbook = XLSX.readFile(excelPath);
  let allProducts = [];

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const parsed = parseSheet(sheetName, sheet);
    allProducts = [...allProducts, ...parsed];
  });

  fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
  console.log(`✅ Parsed ${allProducts.length} products → ${outputPath}`);
}

main();
