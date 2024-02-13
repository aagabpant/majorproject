import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import executeOutlierAnalysisExisting from "./outlier_from_existing.js";
import executeriskAnalysisExisting from "./risk_analysis_existing.js";
import executeKnnOutput from "./knn_output.js";
import executeOutlierAnalysisInput from "./outlier_analysis_input.js";
import executeBankandQuarterExisting from "./bank_and_quarter_existing.js";
import executeBankandVariableExisting from "./bank_and_variable_existing.js";
import executeQuarterandVariableExisting from "./quarter_and_variable_existing.js";
import executeQuarterFromInput from "./quarter_from_input.js";
import executeVariableFromInput from "./variable_from_input.js";
import executeExtractRowHeader from "./extract_row_header.js";
import executeExtractColumnHeader from "./extract_column_headers.js";
import executeWorkOnInput from "./work_on_input.js";
import executeuploadpdf from "./pdf_to_place.js";

const app = express();
const port = 8000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.static("build"));
app.use(bodyParser.json()); // for parsing application/json

app.get("/api/playground", (req, res) => {
  res.send("Hello world");
});

// Handle file upload
app.post("/api/upload-pdf", upload.single("file"), (req, res) => {
  const { access_token } = req.body;
  const filename = req.file.originalname;
  const fileBuffer = req.file.buffer;
  const selectedQuarter = req.body.selectedQuarter;

  const requestParams = {
    access_token,
    filename,
    file: fileBuffer,
    selectedQuarter: selectedQuarter,
  };

  try {
    const outputData = executeuploadpdf(requestParams);
    console.log("Python script output:", outputData);
    res.status(200).json(outputData);
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

async function deleteDirectoryContents(directoryPath) {
  try {
    const files = await fs.promises.readdir(directoryPath);

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.promises.stat(filePath);

        if (stats.isDirectory()) {
          // Recursively delete subdirectory contents
          await deleteDirectoryContents(filePath);
          // Delete the empty subdirectory
          await fs.promises.rmdir(filePath);
        } else {
          // Delete the file
          await fs.promises.unlink(filePath);
        }
      })
    );

    console.log(`Contents of directory deleted: ${directoryPath}`);
  } catch (error) {
    console.error(`Error deleting directory contents: ${directoryPath}`, error);
  }
}

app.post("/api/delete-folder", async (req, res) => {
  try {
    const base_path = "C:/Users/Aagab/PycharmProjects/pythonProject1";
    const { access_token } = req.body;
    const access_token_path = path.join(base_path, access_token);

    // Check if the folder exists using fs.promises.access
    try {
      await fs.promises.access(access_token_path);
    } catch (error) {
      // If access fails, handle the error and send a 404 response
      res.status(404).json({ error: "Folder not found" });
      return;
    }

    // Get a list of files in the folder
    const filesInAccessToken = await fs.promises.readdir(access_token_path);

    // Use Promise.all to asynchronously delete each file
    await Promise.all(
      filesInAccessToken.map(async (file) => {
        const filePath = path.join(access_token_path, file);

        // Check if the file is a regular file (not a directory)
        const fileStats = await fs.promises.stat(filePath);
        if (fileStats.isFile()) {
          await fs.promises.unlink(filePath);
        }
      })
    );
    console.log("bleh");

    // After deleting files, remove the folder itself
    deleteDirectoryContents(path.join(access_token_path, "z output"));

    res.json({ message: "Folder and its contents deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//download file
app.get("/api/download-file/:access_token/:fileName", (req, res) => {
  try {
    const { access_token, fileName } = req.params;
    const filePath = path.join(
      "",
      `C:/Users/Aagab/PycharmProjects/pythonProject1/${access_token}/z output/${fileName}`
    );
    console.log(filePath);
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      console.log("here");
      // Set the appropriate headers for file download
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
      res.setHeader("Content-Type", "application/octet-stream");

      // Create a read stream from the file and pipe it to the response
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      console.log("there");
      // File not found
      res.status(404).send("File not found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//get file list
app.get("/api/get-files/:access_token", (req, res) => {
  const { access_token } = req.params;
  const directoryPath = `C:/Users/Aagab/PycharmProjects/pythonProject1/${access_token}/z output/`;

  // Logic to read files from the directory and send the list as a response
  // For example, using the 'fs' module:

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(files);
    }
  });
});

//work on input
app.post("/api/work-on-input", (req, res) => {
  const requestParams = req.body;

  try {
    const outputData = executeWorkOnInput(requestParams);
    console.log(`Python script output: `, outputData);
    res.status(200).json(outputData); // Sending the Python script output as JSON response
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

// New route to trigger the Python script
app.post("/api/run-risk-analysis", (req, res) => {
  const requestParams = req.body;

  try {
    const outputData = executeriskAnalysisExisting(requestParams);
    console.log(`Python script output: `, outputData);
    res.status(200).json(outputData); // Sending the Python script output as JSON response
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

//for outlier from input
app.post("/api/outlier-from-input", (req, res) => {
  const requestParams = req.body;

  try {
    const outputData = executeOutlierAnalysisInput(requestParams);
    console.log(`Python script output: `, outputData);
    res.status(200).json(outputData); // Sending the Python script output as JSON response
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

//for knn output

app.post("/api/knn-output", (req, res) => {
  const requestParams = req.body;

  try {
    const outputData = executeKnnOutput(requestParams);
    console.log(`Python script output: `, outputData);
    res.status(200).json(outputData); // Sending the Python script output as JSON response
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

//outlier from existing
app.post("/api/outlier-from-existing", (req, res) => {
  const requestParams = req.body;

  try {
    const outputData = executeOutlierAnalysisExisting(requestParams);
    console.log(`Python script output: `, outputData);
    res.status(200).json(outputData); // Sending the Python script output as JSON response
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

//bank and quarter from existing
app.post("/api/bank-and-quarter-from-existing", (req, res) => {
  const requestParams = req.body;

  try {
    const outputData = executeBankandQuarterExisting(requestParams);
    console.log(`Python script output: `, outputData);
    res.status(200).json(outputData); // Sending the Python script output as JSON response
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

//bank and variable from existing
app.post("/api/bank-and-variable-from-existing", (req, res) => {
  const requestParams = req.body;

  try {
    const outputData = executeBankandVariableExisting(requestParams);
    console.log(`Python script output: `, outputData);
    res.status(200).json(outputData); // Sending the Python script output as JSON response
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

//quarter and variable from existing
app.post("/api/variable-and-quarter-from-existing", (req, res) => {
  const requestParams = req.body;

  try {
    const outputData = executeQuarterandVariableExisting(requestParams);
    console.log(`Python script output: `, outputData);
    res.status(200).json(outputData); // Sending the Python script output as JSON response
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

//quarter from input
app.post("/api/quarter-from-input", (req, res) => {
  const requestParams = req.body;

  try {
    const outputData = executeQuarterFromInput(requestParams);
    console.log(`Python script output: `, outputData);
    res.status(200).json(outputData); // Sending the Python script output as JSON response
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

//variable from input
app.post("/api/variable-from-input", (req, res) => {
  const requestParams = req.body;

  try {
    const outputData = executeVariableFromInput(requestParams);
    console.log(`Python script output: `, outputData);
    res.status(200).json(outputData); // Sending the Python script output as JSON response
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

//extract row header
app.post("/api/extract-row-header", (req, res) => {
  const requestParams = req.body;

  try {
    const outputData = executeExtractRowHeader(requestParams);
    console.log(`Python script output: `, outputData);
    res.status(200).json(outputData); // Sending the Python script output as JSON response
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

//extract column headers
app.post("/api/extract-column-header", (req, res) => {
  const requestParams = req.body;

  try {
    const outputData = executeExtractColumnHeader(requestParams);
    console.log(`Python script output: `, outputData);
    res.status(200).json(outputData); // Sending the Python script output as JSON response
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    console.error(errorMessage);
    res.status(500).send(errorMessage);
  }
});

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
