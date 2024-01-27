import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

/* eslint-disable react/prop-types */
const FileRow = ({
  filePair,
  onDelete,
  onFileChange,
  onQuarterChange,
  unavailableQuarters,
}) => {
  return (
    <div className="file-row">
      <input
        type="file"
        accept=".pdf, .png, .jpg, .webp"
        onChange={onFileChange}
      />
      {filePair.file && (
        <div className="file-preview">
          {/* Render file preview based on file type */}
          {filePair.file.type === "application/pdf" ? (
            <div className="pdf-container">
              <Document file={filePair.file}>
                <Page pageNumber={1} renderTextLayer={false} />
              </Document>
            </div>
          ) : filePair.file.type.startsWith("image/") ? (
            <img src={URL.createObjectURL(filePair.file)} alt="File Preview" />
          ) : (
            <p>Unsupported file format</p>
          )}
        </div>
      )}

      {/* Dropdown for selecting the quarter */}
      <select onChange={onQuarterChange} value={filePair.selectedQuarter}>
        <option value="">Select Quarter</option>
        {Array.from({ length: 68 }, (_, index) => {
          const year = Math.floor(index / 4) + 2064;
          const quarter = (index % 4) + 1;
          const quarterString = `Q${quarter} ${year}`;
          return (
            <option
              key={index}
              value={quarterString}
              disabled={unavailableQuarters.includes(quarterString)}
            >
              {quarterString}
            </option>
          );
        })}
      </select>

      {/* Delete button */}
      <button onClick={onDelete}>X</button>
    </div>
  );
};

export default FileRow;
