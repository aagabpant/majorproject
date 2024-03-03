import React, { useState, useEffect } from "react";
import BanklistData from "../data/banklist.js";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import percentileData from "../data/percentile.json";
import ZScoreChart from "../components/zscorehover/z_score_function.jsx";
const Others = () => {
  const tooltips = [
    "Reserves act as a buffer against economic shocks and ensure stability within the financial system.",
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
  const financial_metrics = [
    "Reserves - High Z score indicates a positive result.",
    "Debenture and bond - High Z score indicates a positive result.",
    "Borrowings - Low Z score indicates a positive result.",
    "Deposits - High Z score indicates a positive result.",
    "Income tax liability - Low Z score indicates a positive result.",
    "Other liabilities - Low Z score indicates a positive result.",
    "Total assets - High Z score indicates a positive result.",
    "Loan and advancements - High Z score indicates a positive result.",
    "Interest income - High Z score indicates a positive result.",
    "Interest expense - Low Z score indicates a positive result.",
    "Net interest income - High Z score indicates a positive result.",
    "Net fee and commission income - High Z score indicates a positive result.",
    "Total operating income - High Z score indicates a positive result.",
    "Staff expenses - Low Z score indicates a positive result.",
    "Operating profit - High Z score indicates a positive result.",
    "Non-operating income expense - It depends on the specific situation; there's no general rule for this term.",
    "Profit for the period - High Z score indicates a positive result.",
    "Capital fund to RWA - High Z score indicates a positive result.",
    "Non-performing loan to total loan - Low Z score indicates a positive result.",
    "Total loan loss provision to NPL - Low Z score indicates a positive result.",
    "Cost of fund - Low Z score indicates a positive result.",
    "Base rate - It depends on the specific situation; there's no general rule for this term.",
    "Net interest spread - High Z score indicates a positive result.",
    "Market share price - It depends on the specific situation; there's no general rule for this term.",
    "Return on equity - High Z score indicates a positive result.",
    "Return on total assets - High Z score indicates a positive result.",
    "Credit to deposit ratio - High Z score indicates a positive result.",
    "Debt ratio - Low Z score indicates a positive result.",
    "Interest income to assets ratio - High Z score indicates a positive result.",
    "Interest income margin - High Z score indicates a positive result.",
    "Return on investment - High Z score indicates a positive result.",
    "Commission to operating income - High Z score indicates a positive result.",
    "Staff expense to income ratio - Low Z score indicates a positive result.",
    "Net profit margin - High Z score indicates a positive result.",
    "Income tax portion of operating profit - Low Z score indicates a positive result.",
    "Loan to deposit ratio - High Z score indicates a positive result.",
  ];
  //risk analysis existing
  const [selectedQuarter1, setSelectedQuarter1] = useState(null);
  const [selectedBank1, setSelectedBank1] = useState(null);
  const [selectedQuarterForriskinput, setSelectedQuarterForriskinput] =
    useState(null);

  //outlier analysis existing:
  const [selectedQuarter2, setSelectedQuarter2] = useState(null);
  const [selectedBank2, setSelectedBank2] = useState(null);

  // State for the quarter list obtained from extract-column-header
  const [quarterList, setQuarterList] = useState([]);

  // State for the new quarter dropdown
  const [selectedQuarterForInput, setSelectedQuarterForInput] = useState(null);

  // State for the extracted row headers
  const [variables, setvariablesList] = useState([]);
  const [selectedvariableforOutput, setSelectedVariableForOutput] =
    useState(null);

  ////////////
  //for risk analysis
  const [riskData, setRiskData] = useState([]);
  //for outlier from existing
  const [outlierData, setOutlierData] = useState([]);
  //for risk analysis input
  const [riskInput, setRiskInput] = useState([]);
  //for outlier input
  const [inputOutlierData, setInputOutlierData] = useState([]);

  //for knn
  const [knndata, setKnn] = useState([]);
  const [knncomplete, setKnnComplete] = useState(false);
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

  const handleRunRiskAnalysis = async () => {
    try {
      const requestParams = {
        quarter: selectedQuarter1,
        bank: selectedBank1,
        filepath:
          "C:/Users/Aagab/PycharmProjects/pythonProject1/z score/3d_zscore_table.csv",
        access_token: "z outp", // Replace with the actual access token
      };

      console.log("Sending JSON to Python:", JSON.stringify(requestParams));

      const response = await fetch("/api/run-risk-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestParams),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result); // Access the JSON response
        // ... rest of the code
        setRiskData(result);
      } else {
        console.error("Error calling the API");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleRunRiskAnalysisforinput = async () => {
    try {
      var access_token = "z outp";
      const requestParams = {
        quarter: selectedQuarterForriskinput,
        filepath:
          "C:/Users/Aagab/PycharmProjects/pythonProject1/" +
          access_token +
          "/z output/z_scores.csv",
        access_token: "z outp", // Replace with the actual access token
      };

      console.log("Sending JSON to Python:", JSON.stringify(requestParams));

      const response = await fetch("/api/run-risk-analysis-input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestParams),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result); // Access the JSON response
        setRiskInput(result);
        // ... rest of the code
      } else {
        console.error("Error calling the API");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleRunOutlierfromInput = async () => {
    try {
      const requestParams = {
        quarter: selectedQuarterForInput,
        access_token: "z outp", // Replace with the actual access token
      };

      console.log("Sending JSON to Python:", JSON.stringify(requestParams));

      const response = await fetch("/api/outlier-from-input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestParams),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result); // Access the response as text
        // ... rest of the code
        setInputOutlierData(result);
        console.log("the object is", result);
      } else {
        console.error("Error calling the API");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRunKnnOutput = async () => {
    try {
      const requestParams = {
        access_token: "z outp", // Replace with the actual access token
      };

      console.log("Sending JSON to Python:", JSON.stringify(requestParams));

      const response = await fetch("/api/knn-output", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestParams),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result); // Access the response as text
        setKnn(result);
        setKnnComplete(true);
      } else {
        console.error("Error calling the API");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRunOutlierFromExisting = async () => {
    try {
      // Prepare the request parameters
      const requestParams = {
        access_token: "z outp", // Replace with the actual access token
        quarter: selectedQuarter2,
        bank: selectedBank2,
        filepath:
          "C:/Users/Aagab/PycharmProjects/pythonProject1/z score/3d_zscore_table.csv",
      };

      // Log the JSON being sent to the server
      console.log("Sending JSON to Python:", JSON.stringify(requestParams));

      // Make the API call to the server
      const response = await fetch("/api/outlier-from-existing", {
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
        setOutlierData(result);
      } else {
        // Handle the case where the API call was not successful
        console.error("Error calling the API");
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error:", error);
    }
  };
  const renderTooltip = (index) => (
    <Tooltip id={`tooltip-${index}`} placement="right">
      {tooltips[index]}
    </Tooltip>
  );
  const renderFinancialToolTip = (index) => (
    <Tooltip id={`financial_metrics-${index}`} placement="right">
      {financial_metrics[index]}
    </Tooltip>
  );
  //formatdecimal
  function formatNumberToDecimalPlaces(number, decimalPlaces) {
    // Check if the number is valid
    if (isNaN(number)) {
      return "-";
    }

    // Round the number to the specified decimal places
    const roundedNumber =
      Math.round(number * Math.pow(10, decimalPlaces)) /
      Math.pow(10, decimalPlaces);

    // Convert the rounded number to a string with fixed decimal places
    return roundedNumber.toFixed(decimalPlaces);
  }

  function getPercentileNumber(zScore) {
    console.log("zScore=", zScore);
    const sortedPercentiles = percentileData.percentiles.sort(
      (a, b) => a.zScore - b.zScore
    );

    // If z score is smaller than the lowest z score in the JSON data, return 0%
    if (zScore < sortedPercentiles[0].zScore) {
      return "0%";
    }

    // If z score is larger than the largest z score in the JSON data, return 100%
    if (zScore > sortedPercentiles[sortedPercentiles.length - 1].zScore) {
      return "100%";
    }

    // Find the nearest lower and upper z scores
    let lowerPercentile = null;
    for (const percentile of sortedPercentiles) {
      if (percentile.zScore <= zScore) {
        lowerPercentile = percentile;
      } else {
        break; // Stop iteration once we find the upper z score
      }
    }

    // Return the percentile of the higher z score
    return `${lowerPercentile.percentile}%`;
  }
  const renderTooltipzscore = (index, value) => {
    return (
      <Tooltip
        id={`tooltip-${index}`}
        placement="right"
        className="custom-tooltip-style"
      >
        <div style={{ width: "400px", height: "300px" }}>
          <ZScoreChart value={value} />
        </div>
      </Tooltip>
    );
  };
  return (
    <div className=" my-10 container">
      <div>
        {/* Quarter Dropdown */}
        <div className="flex gap-x-56">
          <div>
            <div className="flex flex-col gap-y-4 my-4">
              <div className="flex gap-x-10">
                <div className="flex flex-col gap-y-2">
                  <label>Select Quarter:</label>
                  <select
                    value={selectedQuarter1}
                    onChange={(e) => setSelectedQuarter1(e.target.value)}
                    style={{ marginBottom: "10px" }}
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
              </div>
              <div className="flex flex-col gap-y-2 ">
                {/* Bank Dropdown for Bank and Quarter Existing Data */}
                <label>Select Bank:</label>
                <select
                  value={selectedBank1}
                  onChange={(e) => setSelectedBank1(e.target.value)}
                  style={{ marginBottom: "10px" }}
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

            <button
              onClick={handleRunRiskAnalysis}
              style={{ display: "block", marginBottom: "10px" }}
              disabled={!selectedQuarter1 || !selectedBank1}
              className={` btn btn-outline  btn-sky-950 w-64 btn-sm  ${
                (!selectedQuarter1 || !selectedBank1) && "text-black"
              }`}
            >
              Run Risk Analysis
            </button>
            {/* RISK ANALYSIS FOR INPUT */}
            <div className="flex flex-col gap-y-2">
              <label>Select Quarter:</label>
              <select
                value={selectedQuarterForriskinput}
                onChange={(e) => setSelectedQuarterForriskinput(e.target.value)}
                style={{ marginBottom: "10px" }}
                className="select select-bordered w-full max-w-xs select-sm"
              >
                <option value="">Select Quarter</option>
                {quarterList.map((quarter, index) => (
                  <option key={index} value={quarter}>
                    {quarter}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleRunRiskAnalysisforinput}
              style={{ display: "block", marginBottom: "10px" }}
              disabled={!selectedQuarterForriskinput}
              className={` btn btn-outline  btn-sky-950 w-64 btn-sm  ${
                !selectedQuarterForriskinput && "text-black"
              }`}
            >
              Run Risk Analysis for input
            </button>
            {/* New Quarter Dropdown for "Quarter from Input" */}
            <div className="flex flex-col gap-y-4">
              <label style={{ marginTop: "20px" }}>
                Select Quarter for Input:
              </label>
              <select
                value={selectedQuarterForInput}
                onChange={(e) => setSelectedQuarterForInput(e.target.value)}
                style={{ marginBottom: "10px" }}
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
            <button
              onClick={handleRunOutlierfromInput}
              style={{ display: "block", marginBottom: "10px" }}
              disabled={!selectedQuarterForInput}
              className={` btn btn-outline  btn-sky-950 w-64 btn-sm  ${
                !selectedQuarterForInput && "text-black"
              }`}
            >
              Outlier from input
            </button>
            <button
              onClick={handleRunKnnOutput}
              style={{ display: "block", marginBottom: "10px" }}
              className=" my-5 btn btn-outline  btn-sky-950 w-64 btn-sm "
            >
              Knn Output
            </button>
            {/*quarter dropdown*/}
            <div className="flex flex-col my-4">
              <div className="flex gap-x-10">
                <div className="flex flex-col  gap-y-4">
                  <label>Select Quarter:</label>
                  <select
                    value={selectedQuarter2}
                    onChange={(e) => setSelectedQuarter2(e.target.value)}
                    style={{ marginBottom: "10px" }}
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

                <div className="flex flex-col gap-y-10">
                  <label>Select Bank:</label>
                  <select
                    value={selectedBank2}
                    onChange={(e) => setSelectedBank2(e.target.value)}
                    style={{ marginBottom: "10px" }}
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
              <button
                onClick={handleRunOutlierFromExisting}
                style={{ display: "block", marginBottom: "10px" }}
                disabled={!selectedQuarter2 || !selectedBank2}
                className={`btn btn-outline btn-sky-950 w-64 btn-sm  ${
                  (!selectedQuarter2 || !selectedBank2) && "text-black"
                }`}
              >
                Outlier from existing
              </button>
            </div>
          </div>
          <div className="container mt-8 mx-36">
            <h2 className="text-xl font-bold mb-4">Instructions</h2>
            <div className="mb-8">
              <h3 className="font-bold">User Input Comparison</h3>
              <ol className="list-decimal pl-4">
                <li>Select Quarter to compare input data with</li>
                <li>Select Bank whose data is to be compared against</li>
                <li>Check the generated result</li>
              </ol>
            </div>
            <div className="mb-8">
              <h3 className="font-bold">Risk Analysis</h3>
              <ol className="list-decimal pl-4">
                <li>Select the quarter to check for Risk Analysis</li>
                <li>Select the bank whose Risk Analysis is to be done</li>
                <li>Index is normalized between -1 and 1</li>
                <li>
                  Where 1 is the best performance and -1 is the worst
                  performance relative to other banks and itself
                </li>
              </ol>
            </div>
            <div className="mb-8">
              <h3 className="font-bold">Check for Outliers</h3>
              <ol className="list-decimal pl-4">
                <li>Select the bank whose outliers are to be checked</li>
                <li>Select the quarter where outliers might be</li>
                <li>Check the results for outliers</li>
                <li>
                  Remarks, 'NO' Outliers doesn't necessarily mean no outliers
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-bold">Finding Similar Banks (KNN)</h3>
              <ol className="list-decimal pl-4">
                <li>
                  Select the bank and quarter whose similarities are to be
                  checked from your previous input
                </li>
                <li>
                  Select the bank and quarter which are to be checked against
                </li>
                <li>Analyze the results generated</li>
              </ol>
            </div>
          </div>
        </div>

        {/* inputOutlierData["z score compared to all banks in this quarter"] */}
        {inputOutlierData &&
          inputOutlierData.variables &&
          inputOutlierData.quarter && (
            <div className="my-5 w-full h-[500px] overflow-scroll">
              <h1 className="sticky my-3">
                Outlier detection table from the given input{" "}
                {inputOutlierData.quarter}.
              </h1>
              <table className="table-custom w-150 p-3">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th>Variable</th>
                    <th>z score compared to all quarters of all banks</th>
                    <th>percentile</th>
                    <th>z score compared to all banks in this quarter</th>
                    <th>percentile</th>
                    <th>Outlier</th>
                  </tr>
                </thead>
                <tbody>
                  {inputOutlierData &&
                    inputOutlierData.variables &&
                    inputOutlierData.quarter &&
                    inputOutlierData.variables.map((x, index) => (
                      <tr key={index}>
                        <td>
                          {
                            <OverlayTrigger
                              placement="right"
                              delay={{ show: 250, hide: 400 }}
                              overlay={renderFinancialToolTip(index)}
                            >
                              <span>{x}</span>
                            </OverlayTrigger>
                          }
                        </td>
                        <td>
                          <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltipzscore(
                              index,
                              inputOutlierData[
                                "z score compared to all banks in this quarter"
                              ][index]
                            )}
                          >
                            <span>
                              {inputOutlierData[
                                "z score compared to all banks in this quarter"
                              ][index] === "nan"
                                ? "-"
                                : formatNumberToDecimalPlaces(
                                    inputOutlierData[
                                      "z score compared to all banks in this quarter"
                                    ][index],
                                    4
                                  )}
                            </span>
                          </OverlayTrigger>
                        </td>
                        <td>
                          {inputOutlierData[
                            "z score compared to all banks in this quarter"
                          ][index] === "nan"
                            ? "-"
                            : getPercentileNumber(
                                inputOutlierData[
                                  "z score compared to all banks in this quarter"
                                ][index]
                              )}
                        </td>
                        <td>
                          <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltipzscore(
                              index,
                              inputOutlierData[
                                "z score compared to all quarters of all banks"
                              ][index]
                            )}
                          >
                            <span>
                              {inputOutlierData[
                                "z score compared to all quarters of all banks"
                              ][index] === "nan"
                                ? "-"
                                : formatNumberToDecimalPlaces(
                                    inputOutlierData[
                                      "z score compared to all quarters of all banks"
                                    ][index],
                                    4
                                  )}
                            </span>
                          </OverlayTrigger>
                        </td>
                        <td>
                          {inputOutlierData[
                            "z score compared to all quarters of all banks"
                          ][index] === "nan"
                            ? "-"
                            : getPercentileNumber(
                                inputOutlierData[
                                  "z score compared to all quarters of all banks"
                                ][index]
                              )}
                        </td>
                        <td>
                          {inputOutlierData["outlier"][index] === false
                            ? "No"
                            : "Yes"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

        {riskData && riskData.quarter && riskData.bank && (
          <div>
            <h1 className="my-3">
              Risk Analysis table from the existing data {riskData.quarter} of{" "}
              {riskData.bank}.
            </h1>
            <table className="table-custom w-150 p-3">
              <tr>
                <th>Parameters</th>
                <th>Value</th>
              </tr>
              <tr>
                <td>Quarter</td>
                <td>{riskData.quarter}</td>
              </tr>
              <tr>
                <td>Bank</td>
                <td>{riskData.bank}</td>
              </tr>
              <tr>
                <td>index compared to all quarters from all banks</td>
                <td>
                  {formatNumberToDecimalPlaces(
                    riskData["index compared to all quarters from all banks"],
                    4
                  )}
                </td>
              </tr>
              <tr>
                <td>index compared to all bank data in given quarter</td>
                <td>
                  {formatNumberToDecimalPlaces(
                    riskData[
                      "index compared to all bank data in given quarter"
                    ],
                    4
                  )}
                </td>
              </tr>
              <tr>
                <td>index compared to all quarters within this bank</td>
                <td>
                  {formatNumberToDecimalPlaces(
                    riskData["index compared to all quarters within this bank"],
                    4
                  )}
                </td>
              </tr>
            </table>
          </div>
        )}

        {riskInput && riskInput.quarter && (
          <div>
            <h1 className="mt-5 my-3">
              Risk Analysis table from the given input {riskInput.quarter}.
            </h1>
            <table className="table-custom w-150 p-3">
              <tr>
                <th>Parameters</th>
                <th>Value</th>
              </tr>
              <tr>
                <td>Quarter</td>
                <td>{riskInput.quarter}</td>
              </tr>
              <tr>
                <td>index compared to all quarters from all banks</td>
                <td>
                  {formatNumberToDecimalPlaces(
                    riskInput["index compared to all quarters from all banks"],
                    4
                  )}
                </td>
              </tr>
              <tr>
                <td>index compared to all bank data in given quarter</td>
                <td>
                  {formatNumberToDecimalPlaces(
                    riskInput[
                      "index compared to all bank data in given quarter"
                    ],
                    4
                  )}
                </td>
              </tr>
              <tr>
                <td>index compared to all quarters within this bank</td>
                <td>
                  {formatNumberToDecimalPlaces(
                    riskInput[
                      "index compared to all quarters within this bank"
                    ],
                    4
                  )}
                </td>
              </tr>
            </table>
          </div>
        )}

        {outlierData && outlierData.variables && outlierData.quarter && (
          <div className="my-5 w-full h-[500px] overflow-scroll">
            <h1 className="my-3">
              Outlier detection table from the {outlierData.bank} for{" "}
              {outlierData.quarter}.
            </h1>
            <table className="table-custom w-150 p-3">
              <thead className="sticky top-0 bg-white">
                <tr>
                  <th>Variable</th>
                  <th>z score compared to all quarters of all banks</th>
                  <th>Percentile</th>
                  <th>z score compared to all banks in this quarter</th>
                  <th>Percentile</th>
                  <th>Outlier</th>
                </tr>
              </thead>
              <tbody>
                {outlierData &&
                  outlierData.variables &&
                  outlierData.quarter &&
                  outlierData.variables.map((x, index) => (
                    <tr key={index}>
                      <td>
                        {" "}
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderFinancialToolTip(index)}
                        >
                          <span>{x}</span>
                        </OverlayTrigger>
                      </td>
                      <td>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltipzscore(
                            index,
                            outlierData[
                              "z score compared to all quarters from all banks"
                            ][index]
                          )}
                        >
                          <span>
                            {outlierData[
                              "z score compared to all quarters from all banks"
                            ][index] === "nan"
                              ? "-"
                              : formatNumberToDecimalPlaces(
                                  outlierData[
                                    "z score compared to all quarters from all banks"
                                  ][index],
                                  4
                                )}
                          </span>
                        </OverlayTrigger>
                      </td>
                      <td>
                        {outlierData[
                          "z score compared to all quarters from all banks"
                        ][index] === "nan"
                          ? "-"
                          : getPercentileNumber(
                              outlierData[
                                "z score compared to all quarters from all banks"
                              ][index]
                            )}
                      </td>
                      <td>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltipzscore(
                            index,
                            outlierData[
                              "z score compared to all banks in given quarter"
                            ][index]
                          )}
                        >
                          <span>
                            {outlierData[
                              "z score compared to all banks in given quarter"
                            ][index] === "nan"
                              ? "-"
                              : formatNumberToDecimalPlaces(
                                  outlierData[
                                    "z score compared to all banks in given quarter"
                                  ][index],
                                  4
                                )}
                          </span>
                        </OverlayTrigger>
                      </td>
                      <td>
                        {outlierData[
                          "z score compared to all banks in given quarter"
                        ][index] === "nan"
                          ? "-"
                          : getPercentileNumber(
                              outlierData[
                                "z score compared to all banks in given quarter"
                              ][index]
                            )}
                      </td>
                      {
                        <td>
                          {outlierData["outlier"][index] === false
                            ? "No"
                            : "Yes"}
                        </td>
                      }
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        {/**knn here */}
        {knndata && knncomplete && (
          <div>
            <h1 className="my-3">Knn table </h1>
            <table className="table-custom w-150 p-3">
              <thead className="sticky top-0 bg-white">
                <tr>
                  <th>Input Quarter</th>
                  <th>closest bank and quarter</th>
                  <th>2nd closest bank and quarter</th>
                  <th>3rd closest bank and quarter</th>
                  <th>4th closest bank and quarter</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(knndata).map((quarter, index) => (
                  <tr key={index}>
                    <td>{quarter}</td>
                    <td>
                      {knndata[quarter]["1st data"].bank}-
                      {knndata[quarter]["1st data"].quarter}
                    </td>
                    <td>
                      {knndata[quarter]["2st data"].bank}-
                      {knndata[quarter]["2st data"].quarter}
                    </td>
                    <td>
                      {knndata[quarter]["3st data"].bank}-
                      {knndata[quarter]["3st data"].quarter}
                    </td>
                    <td>
                      {knndata[quarter]["4st data"].bank}-
                      {knndata[quarter]["4st data"].quarter}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Others;
