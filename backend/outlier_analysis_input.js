import fs from "fs";
import { spawnSync } from "child_process";

// Function to execute and handle the outlier_from_input request
export default function executeOutlierAnalysisInput(requestParams) {
  const {
    quarters,
    banks,
    filepath,
    variable,
    quarter,
    bank,
    filename,
    access_token,
    pythonscriptpath,
  } = requestParams;
  const functionname = "outlier_from_input";

  // Replace 'python' with 'python3' or 'python' based on your system
  const pythonScriptPath =
    pythonscriptpath || "C:/Users/Aagab/PycharmProjects/pythonProject1/main.py";

  // Print the JSON data being sent to Python in the console
  console.log(
    "Sending JSON to Python:",
    JSON.stringify(
      {
        access_token,
        functionname,
        quarters,
        banks,
        filepath,
        variable,
        quarter,
        bank,
        filename,
      },
      null,
      2
    )
  );

  const pythonProcess = spawnSync(
    "C:/Users/Aagab/PycharmProjects/pythonProject1/.venv/Scripts/Python.exe",
    [
      pythonScriptPath,
      JSON.stringify({
        access_token,
        functionname,
        quarters,
        banks,
        filepath,
        variable,
        quarter,
        bank,
        filename,
      }),
    ],
    { stdio: "inherit" }
  );

  if (pythonProcess.error) {
    console.error(`Error from Python script: ${pythonProcess.error.message}`);
    return { error: pythonProcess.error.message };
  } else {
    try {
      // Split the output by lines and parse each line separately
      const outputLines = pythonProcess.stdout
        ? pythonProcess.stdout
            .toString()
            .split("\n")
            .filter((line) => line.trim() !== "")
        : [];
      const outputData = outputLines.map((line) => JSON.parse(line));

      // Read the generated JSON file
      const resultFilePath = `C:/Users/Aagab/PycharmProjects/pythonProject1/${access_token}/z output/outlier_from_input.json`;
      const fileContent = fs.readFileSync(resultFilePath, "utf-8");

      // Delete the file after reading its content
      fs.unlinkSync(resultFilePath);

      // Parse and return the content with the modified structure
      const resultContent = JSON.parse(fileContent);

      const modifiedResult = {
        variables: resultContent.map((entry) => entry.variable),
        "z score compared to all quarters of all banks": resultContent.map(
          (entry) => entry.values[0]
        ),
        "z score compared to all banks in this quarter": resultContent.map(
          (entry) => entry.values[1]
        ),
        outlier: resultContent.map((entry) => entry.outlier),
      };
      modifiedResult["quarter"] = quarter;

      return modifiedResult;
    } catch (error) {
      console.error(`Error parsing Python script output: ${error.message}`);
      return { error: `Error parsing Python script output: ${error.message}` };
    }
  }
}
