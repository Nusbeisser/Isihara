import fs from "fs";
import { Result } from "../types/results.interface";

export const saveCSVToFile = (data: Result[], filePath: string) => {
  const headers = Object.keys(data[0]);
  const csvRows = [];

  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map((header) => {
      if (header == "red" || header == "green" || header == "blue") {
        return JSON.stringify(row[header].avg || 0);
      } else if (header === "time") {
        return JSON.stringify(row[header] || 0);
      }
    });
    csvRows.push(values.join(","));
  }

  fs.writeFileSync(filePath, csvRows.join("\n"), "utf8");
};
