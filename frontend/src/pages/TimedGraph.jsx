import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import CustomDropdown from "../components/CustomDropdown.jsx";
import BanklistData from "../data/banklist.js";

export default function TimedGraph() {
  //delete this later the two useStat Hooks
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [result1, setResult1] = useState({});
  const [error1, setError1] = useState(null);

  const [selectedQuarter1, setSelectedQuarter1] = useState(null);
  const [selectedBank1, setSelectedBank1] = useState(null);

  const [selectedBanks2, setSelectedBanks2] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState(null);

  const [resData, setResData] = useState({});
  const [soloBank, setSoloBank] = useState([]);
  const [sData, setSData] = useState({});

  //////
  // State for the quarter list obtained from extract-column-header
  const [quarterList, setQuarterList] = useState([]);

  // State for the new quarter dropdown
  const [selectedQuarterForInput, setSelectedQuarterForInput] = useState(null);

  // State for the extracted row headers
  const [variables, setvariablesList] = useState([]);
  const [selectedvariableforOutput, setSelectedVariableForOutput] =
    useState(null);

  ////////////
  const handleRunExtractRowHeader = async () => {
    try {
      console.log(isLoading);
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
        const result = await response.json();

        // Display the result in your component as needed
        console.log(result);
        setvariablesList(result.variables);

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

      setIsLoading(true);
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
        setIsLoading(false);
        // Parse the response as text
        const result = await response.json();
        console.log(result);
        console.log("Result columns:", result.columns);
        setQuarterList(result.columns);
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

  ////////

  // useEffect to run when the component mounts
  useEffect(() => {
    // Call the functions when the component mounts
    handleRunExtractRowHeader();
    handleRunExtractColumnHeader();
  }, []); // The empty dependency array ensures that it runs only on mount

  const handleRunBankAndQuarterFromExisting = async () => {
    try {
      if (!selectedQuarter1 || !selectedBank1) {
        console.error("Please select both quarter and bank");
        return;
      }

      // Prepare the request parameters
      const requestParams = {
        access_token: "z outp", // Replace with the actual access token
        quarter: selectedQuarter1,
        bank: selectedBank1,
      };

      // Log the JSON being sent to the server
      console.log("Sending JSON to Python:", JSON.stringify(requestParams));

      setIsLoading(true);
      // Make the API call to the server
      const response = await fetch("/api/bank-and-quarter-from-existing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestParams),
      });

      // Check if the response is successful (status code 200)
      if (response.ok) {
        setIsLoading(false);
        // Parse the response as text
        const result = await response.json();

        console.log(result);

        setSData(result);

        setSoloBank(
          ...result.variable.map((x, index) => ({ [x]: result.values[index] }))
        );

        // Display the r,esult in your component as needed
        console.log(
          result.variable.map((x, index) => ({ [x]: result.values[index] }))
        );

        console.log("Solo bank", soloBank);
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

  const handleRunVariableAndBankFromExisting = async () => {
    try {
      if (!selectedMetric || selectedBanks2.length === 0) {
        console.error("Please select both metric and bank(s)");
        return;
      }

      for (const selectedBank of selectedBanks2) {
        // Prepare the request parameters
        const requestParams = {
          access_token: "z outp", // Replace with the actual access token
          bank: selectedBank,
          variable: selectedMetric,
        };

        // Log the JSON being sent to the server
        console.log("Sending JSON to Python:", JSON.stringify(requestParams));

        // Make the API call to the server
        const response = await fetch("/api/bank-and-variable-from-existing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestParams),
        });

        // Check if the response is successful (status code 200)
        if (response.ok) {
          // Parse the response as text
          const result = await response.json();

          setResult1(result);
        } else {
          // Handle the case where the API call was not successful
          console.error("Error calling the API for bank:", selectedBank);
        }
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error:", error);
    }
  };

  const handleRunQuarterfromInput = async () => {
    try {
      if (!selectedQuarterForInput) {
        console.error("Please select a quarter");
        return;
      }

      // Prepare the request parameters
      const requestParams = {
        access_token: "z outp",
        quarter: selectedQuarterForInput,
        filename: "merged_file.csv",
        // Omitting bank since there is no bank dropdown
      };

      // Log the JSON being sent to the server
      console.log("Sending JSON to Python:", JSON.stringify(requestParams));

      // Make the API call to the server
      const response = await fetch("/api/quarter-from-input", {
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

  const handleRunVariablefromInput = async () => {
    try {
      if (!selectedvariableforOutput) {
        console.error("Please select a row header");
        return;
      }

      // Prepare the request parameters
      const requestParams = {
        access_token: "z outp", // Replace with the actual access token
        variable: selectedvariableforOutput,
        filename: "merged_file.csv",
      };

      // Log the JSON being sent to the server
      console.log("Sending JSON to Python:", JSON.stringify(requestParams));

      // Make the API call to the server
      const response = await fetch("/api/variable-from-input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestParams),
      });

      // Check if the response is successful (status code 200)
      if (response.ok) {
        // Parse the response as text
        const result = await response.json();

        // Display the result in your component as needed
        console.log(result);
        setResult(result);

        // Add your logic here to handle the result, update state, or perform any other actions
        // For example, you might want to setState or dispatch an action in a Redux store

        // Sample logic: Update state with the result
        // updateState(result);

        // ... Add more logic as needed
      } else {
        // Handle the case where the API call was not successful
        console.error("Error calling the API");
        setError("Error calling the API");
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error:", error);
      setError(error.message || "An error occurred");
    }
  };

  return (
    <div className="d-flex">
      <div>
        <h1>this is the timed ggggraph</h1>
        {/* Quarter Dropdown */}
        <label>Select Quarter:</label>
        <select
          value={selectedQuarter1}
          onChange={(e) => setSelectedQuarter1(e.target.value)}
          style={{ marginBottom: "10px" }}
        >
          <option value="">Select Quarter</option>
          {BanklistData.quarterlist.map((quarter, index) => (
            <option key={index} value={quarter}>
              {quarter}
            </option>
          ))}
        </select>

        {/* Bank Dropdown for Bank and Quarter Existing Data */}
        <label>Select Bank:</label>
        <select
          value={selectedBank1}
          onChange={(e) => setSelectedBank1(e.target.value)}
          style={{ marginBottom: "10px" }}
        >
          <option value="">Select Bank</option>
          {BanklistData.bank_list.map((bank, index) => (
            <option key={index} value={bank}>
              {bank}
            </option>
          ))}
        </select>

        {/* Button to run the API call for Bank and Quarter Existing Data */}
        <button
          onClick={handleRunBankAndQuarterFromExisting}
          style={{ display: "block", marginBottom: "10px" }}
          disabled={!selectedQuarter1 || !selectedBank1}
        >
          Bank and Quarter Existing Data
        </button>

        <label>Select Banks:</label>
        <CustomDropdown
          options={BanklistData.bank_list}
          selectedOptions={selectedBanks2}
          onSelect={(option) =>
            setSelectedBanks2((prevSelected) =>
              prevSelected.includes(option)
                ? prevSelected.filter((selected) => selected !== option)
                : [...prevSelected, option]
            )
          }
        />

        {/* Financial Metric Dropdown for Variable and Bank Existing Data */}
        <label>Select Financial Metric:</label>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          style={{ marginBottom: "10px" }}
        >
          <option value="">Select Financial Metric</option>
          {BanklistData.financial_metrics.map((metric, index) => (
            <option key={index} value={metric}>
              {metric}
            </option>
          ))}
        </select>

        {/* Button to run the API call for Variable and Bank Existing Data */}
        <button
          onClick={handleRunVariableAndBankFromExisting}
          style={{ display: "block", marginBottom: "10px" }}
          disabled={!selectedBanks2.length || !selectedMetric}
        >
          Variable and Bank Existing Data
        </button>

        {/* New Quarter Dropdown for "Quarter from Input" */}
        <label>Select Quarter for Input:</label>
        <select
          value={selectedQuarterForInput}
          onChange={(e) => setSelectedQuarterForInput(e.target.value)}
          style={{ marginBottom: "10px" }}
        >
          <option value="">Select Quarter for Input</option>
          {quarterList.map((quarter, index) => (
            <option key={index} value={quarter}>
              {quarter}
            </option>
          ))}
        </select>

        {/* Button to run the API call for Quarter from Input */}
        <button
          onClick={handleRunQuarterfromInput}
          style={{ display: "block", marginBottom: "10px" }}
          disabled={!selectedQuarterForInput}
        >
          Quarter from Input
        </button>

        {/* New Variable Dropdown for "Quarter from Input" */}
        <label>Select Variable for Input:</label>
        <select
          value={selectedvariableforOutput}
          onChange={(e) => setSelectedVariableForOutput(e.target.value)}
          style={{ marginBottom: "10px" }}
        >
          <option value="">Select Variable for Input</option>
          {variables.map((variable, index) => (
            <option key={index} value={variable}>
              {variable}
            </option>
          ))}
        </select>

        {/* Button to run the API call for Variable from Input */}
        <button
          onClick={handleRunVariablefromInput}
          style={{ display: "block", marginBottom: "10px" }}
          disabled={!selectedvariableforOutput}
        >
          Variable from Input
        </button>
        {error && <p>Error: {error}</p>}
        {result && (
          <div>
            <p>Quarters:</p>
            <ul>
              {result.quarters.map((quarter, index) => (
                <li key={index}>{quarter}</li>
              ))}
            </ul>

            <p>Values:</p>
            <ul>
              {result.values.map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
            <p>Variable: {result.variable}</p>
          </div>
        )}

        <table className="table-custom">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {sData &&
              sData.variable &&
              sData.values &&
              sData.variable.map((x, index) => (
                <tr key={index}>
                  <td>{x}</td>
                  <td>{sData.values[index]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {result1 && (
        <div style={{ width: 900 }}>
          {result1.quarter && (
            <Line
              data={{
                labels: result1.quarter,
                datasets: [{ label: result1.variable, data: result1.values }],
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
