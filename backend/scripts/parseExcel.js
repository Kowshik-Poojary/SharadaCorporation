import XLSX from "xlsx";
import fs from "fs";

// Clean category name globally
function cleanCategory(name) {
  // Special rename
  if (name.trim() === "SMI 8_9_10") {
    return "Mini Presentation Items";
  }

  // Remove any trailing digits or _digits
  return name.replace(/[_\s]*\d+$/, "").trim();
}

// Detect header row
function isHeaderRow(row) {
  if (!row) return false;
  const keywords = ["code", "size", "dia", "width", "height", "qty", "cbm", "weight"];
  return row.some(cell =>
    cell &&
    keywords.some(key => String(cell).toLowerCase().includes(key))
  );
}

function parseSheet(sheetName, sheet) {
  const cleanedCategory = cleanCategory(sheetName);
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  let currentProduct = null;
  let header = null;
  const products = [];

  const isProbablyHeader = (row) => {
    if (!row) return false;
    const nonEmpty = row.filter(x => x !== "");
    if (nonEmpty.length < 2) return false;

    // A header usually contains short column labels
    return nonEmpty.every(cell => cell.length <= 12);
  };

  const isProbablyProductName = (row) => {
    if (!row) return false;
    const nonEmpty = row.filter(x => x !== "");
    if (nonEmpty.length !== 1) return false;
    const name = nonEmpty[0];
    return name.length > 2; // avoid capturing random numbers
  };

  rows.forEach((row) => {
    const cleanRow = row.map(cell => String(cell || "").trim());
    const nonEmpty = cleanRow.filter(cell => cell !== "");

    if (nonEmpty.length === 0) return;

    // Detect header by pattern rather than keywords
    if (isProbablyHeader(cleanRow)) {
      header = cleanRow;
      return;
    }

    // Detect product name ANYWHERE in row
    if (isProbablyProductName(cleanRow)) {
      currentProduct = {
        name: nonEmpty[0],
        category: cleanedCategory,
        variants: [],
        imageUrl: "",
        description: ""
      };
      products.push(currentProduct);
      return;
    }

    // Variant rows
    if (header && currentProduct) {
      const variantObj = {};
      header.forEach((key, i) => {
        variantObj[key] = cleanRow[i] || "";
      });
      currentProduct.variants.push({ data: variantObj });
      return;
    }
  });

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

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const parsed = parseSheet(sheetName, sheet);
    allProducts = [...allProducts, ...parsed];
  });

  fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
  console.log(`✅ Parsed ${allProducts.length} products → ${outputPath}`);
}

main();
