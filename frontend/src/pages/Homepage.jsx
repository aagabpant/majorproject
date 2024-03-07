import Image from "../components/bgimage";
import React, { useState, useEffect } from "react";
import BrowsePdf from "../components/BrowsePdf";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
export default function Homepage() {
  const [downloadableFiles, setDownloadableFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleRunExtractRowHeader = async () => {
    try {
      // Prepare the request parameters
      const requestParams = {
        access_token: "z outp", // Replace with the actual access token
        filename: "merged_file.csv",
      };

      // Log the JSON being sent to the server
      console.log("Sending JSON to Python:", JSON.stringify(requestParams));

      // Make the API call to the server
      const response = await fetch("/api/extract-row-header", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestParams),
      });

      // Check if the response is successful (status code 200)
      if (response.ok) {
        // Parse the response as text
        const result = await response.text();

        // Display the result in your component as needed
        console.log(result);

        // Add your logic here to handle the result, update state, or perform any other actions
        // For example, you might want to setState or dispatch an action in a Redux store

        // Sample logic: Update state with the result
        // updateState(result);

        // ... Add more logic as needed
      } else {
        // Handle the case where the API call was not successful
        console.error("Error calling the API");
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error:", error);
    }
  };

  const handleRunExtractColumnHeader = async () => {
    try {
      // Prepare the request parameters
      const requestParams = {
        access_token: "z outp", // Replace with the actual access token
        filename: "merged_file.csv",
      };

      // Log the JSON being sent to the server
      console.log("Sending JSON to Python:", JSON.stringify(requestParams));

      // Make the API call to the server
      const response = await fetch("/api/extract-column-header", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestParams),
      });

      // Check if the response is successful (status code 200)
      if (response.ok) {
        // Parse the response as text
        const result = await response.text();

        // Display the result in your component as needed
        console.log(result);

        // Add your logic here to handle the result, update state, or perform any other actions
        // For example, you might want to setState or dispatch an action in a Redux store

        // Sample logic: Update state with the result
        // updateState(result);

        // ... Add more logic as needed
      } else {
        // Handle the case where the API call was not successful
        console.error("Error calling the API");
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error:", error);
    }
  };

  const handlerunworkoninput = async () => {
    try {
      // Prepare the request parameters
      const requestParams = {
        access_token: "z outp", // Replace with the actual access token
      };
      setIsLoading(true);
      // Make the API call to the server
      const response = await fetch("/api/work-on-input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestParams),
      });

      // Check if the response is successful (status code 200)
      if (response.ok) {
        // Parse the response as text
        const result = await response.text();

        // Display the result in your component as needed
        console.log(result);

        // Extract files from the directory
        const filesResponse = await fetch(
          `/api/get-files/${requestParams.access_token}`
        );
        if (filesResponse.ok) {
          const files = await filesResponse.json();
          setDownloadableFiles(files);
        } else {
          console.error("Error fetching files from the server");
        }
      } else {
        // Handle the case where the API call was not successful
        console.error("Error calling the API");
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      alert("Process Completed. Redirecting to TimeGraph.");
      window.location.href = "/TimedGraph";
    }
  };
  const fetchDownloadableFiles = async () => {
    try {
      const requestParams = {
        access_token: "z outp", // Replace with the actual access token
      };

      const response = await fetch(
        `/api/get-files/${requestParams.access_token}`
      );
      if (response.ok) {
        const files = await response.json();
        setDownloadableFiles(files);
      } else {
        console.error("Error fetching files from the server");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchDownloadableFiles(); // Fetch downloadable files when component mounts
  }, []);
  const handleDownloadFile = async (fileName) => {
    try {
      // Prepare the request parameters
      const requestParams = {
        access_token: "z outp", // Replace with the actual access token
        fileName: fileName,
      };

      // Make the API call to the server to get the file content
      const fileContentResponse = await fetch(
        `/api/download-file/${requestParams.access_token}/${fileName}`
      );
      // Check if the response is successful (status code 200)
      if (fileContentResponse.ok) {
        // Get the file content as a Blob
        const fileBlob = await fileContentResponse.blob();

        // Create a download link
        const downloadLink = document.createElement("a");
        const objectURL = URL.createObjectURL(fileBlob);

        // Set the download link attributes
        downloadLink.href = objectURL;
        downloadLink.download = fileName;

        // Append the download link to the document
        document.body.appendChild(downloadLink);

        // Simulate a click on the download link
        downloadLink.click();

        // Remove the download link from the document
        document.body.removeChild(downloadLink);
      } else {
        // Handle the case where the API call was not successful
        console.error("Error fetching file content from the server");
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error:", error);
    }
  };

  return (
    <div className="my-5 mx-5">
      <Image></Image>
      <BrowsePdf></BrowsePdf>
      <div className="flex flex-col mx-20 w-36">
        <div className="flex flex-row ">
          <button
            onClick={handlerunworkoninput}
            className="bg-sky-700 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            style={{ display: "block", marginBottom: "10px" }}
          >
            Work on Input
          </button>
          <div>
            {isLoading && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
              </div>
            )}
            {/* Your other components */}
          </div>
        </div>
        {/* Display the list of downloadable files */}
        <div>
          {downloadableFiles.length > 0 ? (
            <ul className="pl-4 gap-2">
              {downloadableFiles.map((file, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedFile(file)}
                  className="flex cursor-pointer text-blue-500 hover:text-blue-700 text-sm"
                >
                  <DownloadIcon className="w-4 h-4 mr-1" />
                  {file}
                </li>
              ))}
            </ul>
          ) : (
            <p>No file to download</p>
          )}
        </div>
      </div>

      {/* Add a button to download the selected file */}
      <div className="mx-20 my-2">
        {selectedFile && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDownloadFile(selectedFile)}
            className="text-white"
          >
            Download {selectedFile}
          </Button>
        )}
      </div>
    </div>
  );
}
