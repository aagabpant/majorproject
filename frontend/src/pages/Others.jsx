import React, { useState, useEffect, useRef } from "react";
import data from "../data/location.json"; // Importing JSON data
import LocationOnIcon from "@mui/icons-material/LocationOn";
export default function RiskAnalysis() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const prevSelectedType = useRef("");

  useEffect(() => {
    if (selectedType !== "" && selectedType !== prevSelectedType.current) {
      const names = data[selectedType] ? Object.keys(data[selectedType]) : [];
      setFilteredNames(names);
      setSelectedName("");
      setSelectedDistrict("");
      setDisplayData([]);
      prevSelectedType.current = selectedType;
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedType && selectedName) {
      const districts =
        data[selectedType] && data[selectedType][selectedName]
          ? Object.keys(data[selectedType][selectedName])
          : [];
      setFilteredDistricts(districts);
      setSelectedDistrict("");
      setDisplayData([]);
    }
  }, [selectedType, selectedName]);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleNameChange = (e) => {
    setSelectedName(e.target.value);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleDisplayData = () => {
    const entries = data[selectedType][selectedName][selectedDistrict];
    setDisplayData(entries);
  };

  const openGoogleMapsSearch = (parentBank, branchName) => {
    const searchQuery = `${parentBank} ${branchName}`;
    const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      searchQuery
    )}`;
    window.open(googleMapsURL, "_blank");
  };

  return (
    <div className="my-10 mx-24 container">
      <h1 className="mx-3 from-accent-content font-bold text-lg">
        Please Select the Bank's Information you want to know
      </h1>

      <select
        value={selectedType}
        onChange={handleTypeChange}
        className=" my-6 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 mx-3"
      >
        <option value="">Select Type</option>
        {Object.keys(data).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      {selectedType && (
        <select
          value={selectedName}
          onChange={handleNameChange}
          className=" my-10 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 mx-3"
        >
          <option value="">Select Name</option>
          {filteredNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}
      {selectedType && selectedName && (
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          className=" my-10 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 mx-3"
        >
          <option value="">Select District</option>
          {filteredDistricts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      )}
      {selectedDistrict && (
        <button
          onClick={handleDisplayData}
          className="py-2 px-4 bg-sky-900 text-white rounded-md hover:bg-sky-800 focus:outline-none focus:ring focus:ring-blue-400"
        >
          Display Data
        </button>
      )}
      {displayData.length > 0 && (
        <div className="w-full h-[500px] overflow-scroll">
          <table className="table-custom">
            <thead>
              <tr>
                <th>Code</th>
                <th>Address</th>
                <th>District</th>
                <th>Branch Name</th>
                <th>Open Date</th>
                <th>Google Maps Search</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.address}</td>
                  <td>{entry.district}</td>
                  <td>{entry.branch_name}</td>
                  <td>{entry.open_date}</td>

                  <td>
                    <button
                      onClick={() =>
                        openGoogleMapsSearch(selectedName, entry.branch_name)
                      }
                    >
                      <LocationOnIcon></LocationOnIcon>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
