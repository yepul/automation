const ExcelJS = require("exceljs");
const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");
const moment = require("moment");

const timestamp = moment().format("YYYYMMDD_HHmm");

// Function to display a simple text-based loader
function showLoader() {
  const spinner = ["|", "/", "-", "\\"];
  let i = 0;
  return setInterval(() => {
    process.stdout.write(`\rLoading, ${spinner[i]}`);
    i = (i + 1) % spinner.length;
  }, 200);
}

async function captureAndSaveScreenshots(urls) {
  const loadingInterval = showLoader();

  // Create a new Excel workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("DSP");

  // Set the titles in row 1
  worksheet.getCell("A1").value = "#";
  worksheet.getCell("B1").value = "URL";
  worksheet.getCell("C1").value = "Image";
  worksheet.getCell("D1").value = "Status";

  // Initialize the current row
  let currentRow = 2;

  // Iterate over the list of URLs
  for (const imageUrl of urls) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(imageUrl);
    const screenshotPath = path.join(
      __dirname,
      "image",
      `${timestamp}_screenshot_${currentRow - 1}.png`
    );
    await page.screenshot({ path: screenshotPath });
    await browser.close();

    // Add the screenshot image to the worksheet
    const image = workbook.addImage({
      filename: screenshotPath,
      extension: "png",
    });

    try {
      worksheet.addImage(image, {
        tl: { col: 2, row: currentRow },
        ext: { width: 100, height: 100 },
      });
      worksheet.getCell(`D${currentRow}`).value = "Yes";
    } catch (error) {
      worksheet.getCell(`D${currentRow}`).value = "No";
    }

    // Set the current time in cell A2, A3, ...
    worksheet.getCell(`A${currentRow}`).value = currentRow - 1;

    // Set the image URL in cell B2, B3, ...
    worksheet.getCell(`B${currentRow}`).value = imageUrl;

    // Increment the current row
    currentRow++;

    // Set column widths to ensure data fits
    worksheet.getColumn("A").width = 10;
    worksheet.getColumn("B").width = 80;
    worksheet.getColumn("C").width = 20;

    // Center-align the text in cells A1, B1, and C1
    worksheet.getCell("A1").alignment = { horizontal: "center" };
    worksheet.getCell("B1").alignment = { horizontal: "center" };
    worksheet.getCell("C1").alignment = { horizontal: "center" };
  }

  // Clear the loader and stop the interval
  clearInterval(loadingInterval);
  process.stdout.write("\r"); // Clear the loading line

  // Save the Excel file
  await workbook.xlsx.writeFile("excel/" + timestamp + ".xlsx");
  console.log("Excel file with screenshots and data saved.");
}

const urlsToCapture = [
  "https://www.etiqa.com.my/v2/homepage",
  "https://www.motortakaful.com/motorcar/en/takaful/getquote1",
  "https://www.etiqa.com.my/motorcar/en/insurance/getquote1",
  "https://www.motortakaful.com/motorcycle/en/takaful/getquote1",
  "https://www.etiqa.com.my/motorcycle/en/insurance/getquote1",
  "https://www.etiqa.com.my/tripcare360-new/en/insurance/qq1",
  "https://www.etiqa.com.my/tripcare360-new/en/takaful/qq1",
  "https://www.etiqa.com.my/getonline/TravelEzyInsurance",
  "https://www.etiqa.com.my/getonline/TravelEzyTakaful",
  "https://etiqa.com.my/myrumah/insurance/en/qq1",
  "https://etiqa.com.my/myrumah/takaful/en/qq1",
  "https://www.etiqa.com.my/hohh/insurance/en/qq1",
  "https://www.etiqa.com.my/hohh/takaful/en/qq1",
  "https://www.etiqa.com.my/oto360/en/takaful/getquote",
  "https://www.etiqa.com.my/oto360/en/insurance/getquote",
  "https://www.etiqa.com.my/getonline/BuddyInsurance",
  "https://www.etiqa.com.my/getonline/BuddyTakaful",
  "https://www.etiqa.com.my/icare-oku/en/takaful/tkf-en-qq1",
  "https://www.etiqa.com.my/icare-oku/en/takaful/tkf-en-qq1",
  "https://www.etiqa.com.my/termlife/isecure/en/qq1",
  "https://etiqa.com.my/termlife/ezylifesecure/en/qq1",
  "https://www.etiqa.com.my/termlife/ezysecure/en/qq1",
  "https://www.etiqa.com.my/termlife/idoublesecure/en/qq1",
  "https://www.etiqa.com.my/medical-family/en/insurance/ins-en-qq1",
  "https://www.etiqa.com.my/medical-family/en/takaful/tkf-en-qq1",
  "https://www.etiqa.com.my/cancer-care/en/insurance/qq1",
  "https://www.etiqa.com.my/cancer-care/en/takaful",
  "https://www.motortakaful.com/home",
];

captureAndSaveScreenshots(urlsToCapture).catch((error) => {
  console.error("Error:", error);
});
