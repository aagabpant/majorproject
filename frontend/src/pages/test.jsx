import React, { useState } from "react";

function MyComponent() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleRunVariablefromInput = async () => {
    try {
      // ... (your existing code)

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        // Set the result in state
        setResult(result.quarters);
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
    <div>
      <button onClick={handleRunVariablefromInput}>
        Run Variable from Input
      </button>
      {error && <p>Error: {error}</p>}
      {result && <p>Result: {result}</p>}
    </div>
  );
}

export default MyComponent;
