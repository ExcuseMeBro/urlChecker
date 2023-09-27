import axios from "axios";
import XLSX from "xlsx";
import fs from "fs";

const filePath = "./file.xls";

function excelFileToJSON() {
  try {
    var workbook = XLSX.readFile(filePath);
    var result = {};
    workbook.SheetNames.forEach(function (sheetName) {
      var roa = XLSX.utils.sheet_to_row_object_array(
        workbook.Sheets[sheetName]
      );
      if (roa.length > 0) {
        result = roa;
      }
    });
    return result;
  } catch (e) {
    console.error(e);
  }
}

function writeFileRes(fPath, content) {
  fs.appendFile(fPath, content, (err) => {
    if (err) {
      console.error("Error writing to the file:", err);
    }
  });
}

excelFileToJSON()?.map(async (item, idx) => {
  await axios
    .get(
      `https://d3r7rwwil73pe1.cloudfront.net/media/products/${item?.filename}/${item?.filename}.jpeg`
    )
    .then((res) => {
      console.log(idx + ". " + item?.filename + " ACCESS");
      writeFileRes("./access.txt", `${item?.filename}\n`)
    })
    .catch((err) => {
      console.log(idx + ". " + item?.filename + " DENIED");
      writeFileRes("./denied.txt", `${item?.filename}\n`)
    });
});
