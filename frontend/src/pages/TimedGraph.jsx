import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
// import CustomDropdown from "../components/CustomDropdown.jsx";
import BanklistData from "../data/banklist.js";

import cleaner from "../data/cleaner_functions.js";
import Spinner from "react-bootstrap/Spinner";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import GraphData from "../classes/classes.js";
import CreateLineChartDyanamic from "../components/DynamicGraph.jsx";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Form } from "react-bootstrap";
import styled from "styled-components";
import processQuarters from "../components/scatterPlot/scatter_nan.js";
import CreateScatterPlot from "../components/scatterPlot/scatter_function.jsx";
import GenerateGraph from "../components/scatterPlot/combined_function.jsx";
import CircularProgress from "@mui/material/CircularProgress";
//for styled options
const StyledLabel = styled.label`
  /* Add your label styling here */
  font-family: serif;
  font-size: 22px;
`;

export default function TimedGraph() {
  //information to be displayed in while hovering in the table
  const tooltips = [
    "Reservess act as a buffer against economic shocks and ensure stability within the financial system.",
    "Long-term borrowing instruments issued by corporations, often with fixed interest rates, offering investors a steady stream of income over time. They provide debt security.",
    "The act of taking money from a bank and paying it back over a period of time.",
    "A deposit is essentially your money that you transfer to another party.",
    "Income tax liability is the amount owed to the government based on taxable income, impacting financial planning and budgeting.",
    "Other liabilities are the amounts owed to the public and are not reported elsewhere in the balance sheet.",
    "Total assets represent the combined value of possessions and investments, indicating financial worth and influencing strategic decisions.",
    "Loans and advancements are funds provided by banks for borrowing, enabling individuals or businesses to pursue various financial goals, repaid with interest over time.",
    "Interest income is money earned from investments or savings, like bond interest or bank deposits, contributing to financial growth.",
    "Interest expense is the cost of borrowing funds, impacting profitability.",
    "Net interest income is the profit generated from interest earnings minus interest expenses.",
    "Net fee and commission income is the revenue from fees and commissions after subtracting related expenses, reflecting non-interest income profitability.",
    "Total operating income is the revenue generated from core business activities before subtracting expenses.",
    "Staff expenses represent the costs incurred by a company related to its employees, including salaries, wages, benefits, and payroll taxes.",
    "Operating profit is the revenue remaining after deducting operating expenses, indicating the profitability of a company's core business activities.",
    "Gains or losses generated from activities outside a company's primary business operations.",
    "Profit for the period is the net income earned by a company over a specific time frame, typically calculated by subtracting all expenses from total revenue.",
    "Measures a bank's capital adequacy by comparing its capital reserves to its risk-weighted assets, indicating its ability to absorb potential losses.",
    "The proportion of loans within a bank's portfolio that are not generating income due to non-payment.",
    "The provision-to-NPL ratio assesses a bank's reserve adequacy for managing credit risk.",
    "Expenses incurred by a financial institution to acquire capital for lending purposes.",
    "The base rate is the benchmark interest rate set by a central bank or financial authority.",
    "Difference between the interest earned on assets and the interest paid on liabilities.",
    "The current trading price of a company's stock on the open market.",
    "Return on equity (ROE) measures a company's profitability by expressing its net income as a percentage of shareholders' equity.",
    "Return on total assets (ROA) evaluates a company's profitability by expressing its net income as a percentage of its total assets.",
    "The credit-to-deposit ratio assesses a bank's lending activities by comparing the total amount of loans extended to customers to the deposits it holds.",
    "Also known as the debt-to-equity ratio, measures a company's leverage by comparing its total debt to its total equity.",
    "The interest income to assets ratio evaluates a company's ability to generate interest income relative to its total assets.",
    "Interest income margin is a measure of profitability that assesses the efficiency of a company's interest-earning assets in generating interest income.",
    "Return on investment (ROI) measures the profitability of an investment by comparing the gain or loss generated relative to the cost of the investment.",
    "Commission to operating income ratio assesses the portion of a company's operating income generated from commission-based activities.",
    "The staff expense to income ratio evaluates the proportion of a company's income allocated to staff-related expenses.",
    "Net profit margin measures a company's profitability by expressing its net income as a percentage of its total revenue.",
    "The portion of a company's operating profit that is allocated to income taxes, reflecting the taxes paid on the company's earnings before interest and taxes (EBIT).",
    "Assesses a bank's lending activities by comparing the total amount of loans it has extended to customers to the amount of deposits it holds.",
    // Add more tooltips as needed
  ];


export default function TimedGraph() {

  //delete this later the two useStat Hooks
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  //loading animation
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedQuarter1, setSelectedQuarter1] = useState(null);
  const [selectedBank1, setSelectedBank1] = useState(null);
  const [table, setTable] = useState(false);

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

  const [compareTableData, setCompareTableData] = useState(null);

  // Function to handle comparison and creation of the new table
  const handleCompareTables = () => {
    if (!sData || !iData) {
      console.error("Data not available for comparison");
      return;
    }

    // Find common variables between sData and idata
    const commonVariables = sData.variable.filter((variable) =>
      iData.variable.includes(variable)
    );

    // Filter sData and idata to include only common variables
    const sDataFiltered = sData.variable.reduce((acc, variable, index) => {
      if (commonVariables.includes(variable)) {
        acc[variable] = sData.values[index];
      }
      return acc;
    }, {});

    const idataFiltered = iData.variable.reduce((acc, variable, index) => {
      if (commonVariables.includes(variable)) {
        acc[variable] = iData.values[index];
      }
      return acc;
    }, {});

    // Combine filtered sData and idata into a new array
    const combinedData = commonVariables.map((variable) => ({
      variable,
      sValue: sDataFiltered[variable],
      iValue: idataFiltered[variable],
    }));

    // Update state to render the new table
    setCompareTableData(combinedData);
  };

  //////////// for loading
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
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
  const handleruncombine = async () => {
    if (selectedvariableforOutput !== selectedMetric) {
      return;
    }
    setcombine(true);

    console.log("combine");
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
      setIsLoading(true);
      // Prepare the request parameters
      const requestParams = {
        access_token: "z outp", // Replace with the actual access token
        quarter: selectedQuarter1,
        bank: selectedBank1,
      };

      // Log the JSON being sent to the server
      console.log("Sending JSON to Python:", JSON.stringify(requestParams));

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
    } finally {
      setIsLoading(false); // Set loading to false when fetching completes
    }
  };

  //function to hadle the graph
  const handleRunVariableAndBankFromExisting = async () => {
    try {
      if (!selectedMetric) {
        console.error("Please select both metric and bank(s)");
        return;
      }
      setLoading(true);
      console.log(BanklistData.bank_list);
      for (let i = 0; i < BanklistData.bank_list.length; i++) {
        // Prepare the request parameters
        const requestParams = {
          access_token: "z outp", // Replace with the actual access token
          bank: BanklistData.bank_list[i],
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

          console.log(result);

          const graphinstance = new GraphData(
            BanklistData.bank_list[i],
            "Timed_line",
            result,
            selectedMetric
          );
          list_of_data.push(graphinstance);
        } else {
          // Handle the case where the API call was not successful
          console.error(
            "Error calling the API for bank:",
            BanklistData.bank_list[i]
          );
        }
      }
      var x = list_of_data;
      console.log(x);

      //Use the state callback to update linechartdata
      setlinechartdata((prevData) => {
        return x;
      });
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  //useffect to handle the Progress Bar
  useEffect(() => {
    if (loading) {
      const totalSteps = (95 * 1000) / 500; // Convert 34 seconds to milliseconds and divide by interval (500 milliseconds)
      let currentStep = 0;
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          currentStep++;
          const nextProgress = (currentStep / totalSteps) * 100;
          if (nextProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return parseFloat(nextProgress.toFixed(0));
        });
      }, 500); // Adjust the interval for the progress

      // Simulate process completion after a certain delay (replace this with your actual process completion logic)
      setTimeout(() => {
        setProgress(100);
        setLoading(false); // Set loading to false to stop the progress bar
      }, 70000); // 70 seconds delay as per your totalSteps

      return () => clearInterval(interval);
    }
  }, [loading]);
  const handleRunQuarterfromInput = async () => {
    try {
      if (!selectedQuarterForInput) {
        console.error("Please select a quarter");
        return;
      }
      setIsLoading1(true);
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
        const result = await response.json();

        // Display the result in your component as needed
        console.log(result);
        setIData(result);

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
    } finally {
      setIsLoading1(false); // Set loading to false when fetching completes
    }
  };

  const handleRunVariablefromInput = async () => {
    try {
      if (!selectedvariableforOutput) {
        console.error("Please select a row header");
        return;
      }
      setIsLoading2(true);
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
        /**
         * Stringifies the request parameters object and sends it in the request body.
         */
        body: JSON.stringify(requestParams),
      });

      // Check if the response is successful (status code 200)
      if (response.ok) {
        // Parse the response as text
        /**
         * Parses the JSON response from the API call.
         */
        const result = await response.json();

        // Display the result in your component as needed
        console.log(result);
        setResult(result);

        // Sample logic: Update state with the result
        // updateState(result);

        // ... Add more logic as needed
        const holder = processQuarters(result, BanklistData.quarterlist);

        const newresult = {
          quarter: holder.quarters,
          values: holder.values,
          bank: "Input Data",
          variable: setSelectedVariableForOutput,
        };
        const scatterinstance = new GraphData(
          "Input Data",
          "ScatterPlot",
          newresult,
          setSelectedVariableForOutput
        );
        scatter_data.push(scatterinstance);

        // Add your logic here to handle the result, update state, or perform any other actions
        // For example, you might want to setState or dispatch an action in a Redux store

        // Sample logic: Update state with the result
        // updateState(result);

        // ... Add more logic as needed
      } else {
        // Handle the case where the API call was not successful
        console.error("Error calling the API");
      }

      var y = scatter_data;
      console.log(y);

      setscatterplotdata((prevData) => {
        return y;
      });
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error:", error);
    } finally {
      setIsLoading2(false); // Set loading to false when fetching completes
    }
  };

  return (
    <div className="d-flex">
      <div>

        <div className="flex gap-x-16">
          <div>
            {/* Quarter Dropdown */}
            <div className="flex flex-col my-4 gap-y-4">
              <div className="flex gap-x-10">
                <div className="flex flex-col gap-y-2">
                  <label>Select Quarter:</label>
                  <select
                    value={selectedQuarter1}
                    onChange={(e) => setSelectedQuarter1(e.target.value)}
                    className="select select-bordered w-full max-w-xs select-sm"
                  >
                    <option value="">Select Quarter</option>
                    {BanklistData.quarterlist.map((quarter, index) => (
                      <option key={index} value={quarter}>
                        {quarter}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-y-2">
                  <label>Select Bank:</label>
                  <select
                    value={selectedBank1}
                    onChange={(e) => setSelectedBank1(e.target.value)}
                    className="select select-bordered w-full max-w-xs select-sm"
                  >
                    <option value="">Select Bank</option>
                    {BanklistData.bank_list.map((bank, index) => (
                      <option key={index} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Bank Dropdown for Bank and Quarter Existing Data */}
              {/* Button to run the API call for Bank and Quarter Existing Data */}
              <button
                onClick={handleRunBankAndQuarterFromExisting}
                disabled={!selectedQuarter1 || !selectedBank1}
                className={`btn btn-outline bg-sky-900 hover:bg-sky-800 text-white font-bold  rounded focus:outline-none focus:shadow-outline w-64 btn-sm  ${
                  (!selectedQuarter1 || !selectedBank1) &&
                  "bg-gray-200 cursor-not-allowed hover:bg-gray-500"
                }`}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress
                      size={20}
                      style={{
                        position: "absolute",
                        left: "50%",
                        marginLeft: -10,
                        color: "white",
                      }}
                    />
                  </>
                ) : (
                  "Quarterly Report from DataSet"
                )}
              </button>
            </div>
            <div className="flex flex-col gap-y-4 my-4">
              {/* Financial Metric Dropdown for Variable and Bank Existing Data */}
              <div className="flex flex-col gap-y-2">
                <label>Select Financial Metric:</label>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="select select-bordered w-full max-w-xs select-sm"
                >
                  <option value="">Select Financial Metric</option>
                  {BanklistData.financial_metrics.map((metric, index) => (
                    <option key={index} value={metric}>
                      {cleaner.capitalizeFirstLetter(metric)}
                    </option>
                  ))}
                </select>
              </div>
              {/* this is the graph generating buttonnnnnnnnnnnnnnnnnnnnnnnnnnnn */}
              {/* Button to run the API call for Variable and Bank Existing Data */}
              <button
                onClick={handleRunVariableAndBankFromExisting}
                className={`btn btn-outline bg-sky-900 hover:bg-sky-800 text-white font-bold  rounded focus:outline-none focus:shadow-outline w-64 btn-sm  ${
                  !selectedMetric &&
                  "bg-gray-200 cursor-not-allowed hover:bg-gray-500"
                }`}
                disabled={!selectedMetric}
                isLoading={setLoading}
              >
                TimeLine Chart from DataSet
              </button>
            </div>
            <div className="my-4 flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                {/* New Quarter Dropdown for "Quarter from Input" */}
                <label>Select Quarter for Input:</label>
                <select
                  value={selectedQuarterForInput}
                  onChange={(e) => setSelectedQuarterForInput(e.target.value)}
                  className="select select-bordered w-full max-w-xs select-sm"
                >
                  <option value="">Select Quarter for Input</option>
                  {quarterList.map((quarter, index) => (
                    <option key={index} value={quarter}>
                      {quarter}
                    </option>
                  ))}
                </select>
              </div>
              {/* Button to run the API call for Quarter from Input */}
              <button
                onClick={handleRunQuarterfromInput}
                disabled={!selectedQuarterForInput}
                className={`btn btn-outline bg-sky-900 hover:bg-sky-800 text-white font-bold  rounded focus:outline-none focus:shadow-outline w-64 btn-sm  ${
                  !selectedQuarterForInput &&
                  "bg-gray-200 cursor-not-allowed hover:bg-gray-500"
                }`}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isLoading1 ? (
                  <>
                    <CircularProgress
                      size={20}
                      style={{
                        position: "absolute",
                        left: "50%",
                        marginLeft: -10,
                        color: "white",
                      }}
                    />
                  </>
                ) : (
                  "Quarterly Report from Input"
                )}
              </button>
            </div>
            <div className="my-4 flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                {/* New Variable Dropdown for "Quarter from Input" */}
                <label>Select Variable for Input:</label>
                <select
                  value={selectedvariableforOutput}
                  onChange={(e) => setSelectedVariableForOutput(e.target.value)}
                  className="select select-bordered w-full max-w-xs select-sm"
                >
                  <option value="">Select Variable for Input</option>
                  {variables.map((variable, index) => (
                    <option key={index} value={variable}>
                      {cleaner.capitalizeFirstLetter(variable)}
                    </option>
                  ))}
                </select>
              </div>
              {/* Button to run the API call for Variable from Input */}
              <button
                onClick={handleRunVariablefromInput}
                disabled={!selectedvariableforOutput}
                className={`btn btn-outline bg-sky-900 hover:bg-sky-800 text-white font-bold  rounded focus:outline-none focus:shadow-outline w-64 btn-sm  ${
                  !selectedvariableforOutput &&
                  "bg-gray-200 cursor-not-allowed hover:bg-gray-500"
                }`}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isLoading2 ? (
                  <>
                    <CircularProgress
                      size={20}
                      className="text-white"
                      style={{
                        position: "absolute",
                        left: "50%",
                        marginLeft: -10,
                      }}
                    />
                  </>
                ) : (
                  " ScatterPlot from Input"
                )}
              </button>
            </div>
          </div>

          {error && <p>Error: {error}</p>}
          {loading ? (
            <div style={{ width: "900px" }}>
              <ProgressBar
                animated
                now={progress}
                variant="dark"
                label={`${progress}%`}
              />
            </div>
          ) : (
            linechartdata &&
            complete && (
              <div className="my-4">
                <CreateLineChartDyanamic data={linechartdata} />{" "}
              </div>
            )
          )}
        </div>

        <div>
          {/* Render the Scatter Plot based on the scatterplotData */}
          {scatterplotdata && scattercomplete && (
            <CreateScatterPlot data={scatterplotdata} />
          )}
          <button
            onClick={handleruncombine}
            style={{
              display:
                selectedvariableforOutput &&
                selectedMetric &&
                scatterplotdata &&
                linechartdata
                  ? "block"
                  : "none",
              marginBottom: "10px",
            }}
            disabled={
              !selectedvariableforOutput ||
              !selectedMetric ||
              !scatterplotdata ||
              !linechartdata
            }
            className={` my-3 btn btn-outline bg-sky-900 hover:bg-sky-800 w-64 btn-sm text-white ${
              !selectedvariableforOutput && "text-black"
            }`}
          >
            Combine Graph
          </button>

          {/* Render the Scatter Plot based on the scatterplotData */}
          {scatterplotdata &&
            scattercomplete &&
            linechartdata &&
            complete &&
            combine && (
              <GenerateGraph
                lineData={linechartdata}
                scatterData={scatterplotdata}
              />
            )}
        </div>

        {sData && sData.variable && sData.values && (
          <div className="my-5">
            <div className="flex justify-between">
              <h1 className="my-3">
                Table for {sData.bank} of {sData.quarter}.
              </h1>
              <h1
                className="my-2 italic font-medium"
                style={{ marginRight: "50px", textDecoration: "underline" }}
              >
                Rs. in '000{" "}
              </h1>
            </div>
            <div className="w-full h-[500px] overflow-scroll">
              <table className="table-custom w-150 p-3">
                <thead className="sticky top-0 bg-white">
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
                        <td> {cleaner.capitalizeFirstLetter(x)}</td>
                        <td>
                          <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip(index)}
                          >
                            <span>
                              {sData.values[index] === "nan"
                                ? "-"
                                : cleaner.addCommasToNumber(
                                    sData.values[index]
                                  )}
                            </span>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {iData && iData.variable && iData.values && (
          <div className="my-5">
            <div className="flex justify-between">
              <h1 className="my-3">
                Table from the Given Input {iData.quarter}.
              </h1>
              <h1
                className="my-2 italic font-medium"
                style={{ marginRight: "50px", textDecoration: "underline" }}
              >
                Rs. in '000{" "}
              </h1>
            </div>
            <div className="w-full h-[500px] overflow-scroll">
              <table className="table-custom w-150 p-3 w-full h-[500px] overflow-scroll">
                <thead>
                  <tr>
                    <th>Variable</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {iData &&
                    iData.variable &&
                    iData.values &&
                    iData.variable.map((x, index) => (
                      <tr key={index}>
                        <td>{cleaner.capitalizeFirstLetter(x)}</td>
                        <td>
                          <span>
                            {iData.values[index] === "nan"
                              ? "-"
                              : cleaner.addCommasToNumber(iData.values[index])}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {iData && iData.variable && iData.values && sData.variable && (
          <button
            onClick={handleCompareTables}
            className="py-2 px-4 bg-sky-900 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring focus:ring-blue-400"
          >
            Compare Tables
          </button>
        )}

        {/* Render the comparison table if compareTableData is available */}
        {compareTableData && (
          <div className="my-5">
            <h1 className="my-3">
              Comparison Table between {sData.quarter} of {sData.bank} and Input
            </h1>
            <table className="table-custom w-150 p-3">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Dataset Value</th>
                  <th>Input Value</th>
                </tr>
              </thead>
              <tbody>
                {compareTableData.map((data, index) => (
                  <tr key={index}>
                    <td>{cleaner.capitalizeFirstLetter(data.variable)}</td>
                    <td>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip(index)}
                      >
                        <span>
                          {data.sValue === "nan"
                            ? "-"
                            : cleaner.addCommasToNumber(data.sValue)}
                        </span>
                      </OverlayTrigger>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip(index)}
                      >
                        <span>
                          {data.iValue === "nan"
                            ? "-"
                            : cleaner.addCommasToNumber(data.iValue)}
                        </span>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
