import fs from "fs";
import path from "path";

// Function to execute and handle the extract_column_header request
export default function executeExtractColumnHeader(requestParams) {
  const { access_token, filename } = requestParams;

  // Define the base path
  const basePath = path.join(
    "C:/Users/Aagab/PycharmProjects/pythonProject1",
    access_token
  );

  // Define the path for the 'z output' folder
  const zOutputFolderPath = path.join(basePath, "z output");
  console.log(fs.existsSync(zOutputFolderPath));
  console.log(fs.readdirSync(zOutputFolderPath).length);
  // Check if 'z output' folder exists and is not empty
  if (
    fs.existsSync(zOutputFolderPath) &&
    fs.readdirSync(zOutputFolderPath).length > 0
  ) {
    // Function to filter filenames by extension
    const filterByExtension = (extension) => {
      const files = fs.readdirSync(basePath);
      return files
        .filter((file) => path.extname(file).toLowerCase() === extension)
        .map((file) => path.parse(file).name);
    };

    // Get filenames for each extension
    const pdfFiles = filterByExtension(".pdf");
    const jpgFiles = filterByExtension(".jpg");
    const pngFiles = filterByExtension(".png");

    // Combine unique filenames from different extensions
    const uniqueFilenames = Array.from(
      new Set([...pdfFiles, ...jpgFiles, ...pngFiles])
    );

    // Create the result JSON
    const resultContent = {
      columns: uniqueFilenames,
    };

    return resultContent;
  } else {
    // 'z output' folder is either not present or empty
    // Return an empty column list
    return { columns: [] };
  }
}
