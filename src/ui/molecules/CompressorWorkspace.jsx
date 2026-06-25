import { Card, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faDownload } from "@fortawesome/free-solid-svg-icons";

export default function CompressorWorkspace({
  hasImage,
  originalUrl,
  quality,
  onQualityChange,
  originalSize,
  compressedSize,
  onUpload,
  onCompress,
  onReset,
  isCompressing,
  hasCompressedImage,
  compressedUrl,
  onOpenModal,
  originalFileName,
}) {
  return (
    <div className="row mt-4">
      <div className="col-lg-3 text-center">
        {hasImage ? (
          <Card.Img src={originalUrl} alt="Original" className="image" />
        ) : (
          <div className="upload-placeholder p-5">
            <FontAwesomeIcon icon={faUpload} size="3x" />
          </div>
        )}

        <label htmlFor="uploadBtn" className="btn btn-primary mt-3">
          <FontAwesomeIcon icon={faUpload} className="me-2" />
          Upload Image
        </label>

        <input
          id="uploadBtn"
          type="file"
          accept="image/*"
          hidden
          onChange={onUpload}
        />
      </div>

      <div className="col-lg-6 text-center">
        {hasImage && (
          <>
            <label className="mb-2">Quality: {quality}</label>

            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              className="form-range"
              onChange={(event) => onQualityChange(Number(event.target.value))}
            />

            <p>
              Original Size: {Math.round(originalSize / 1024)} KB
              <br />
              Compressed Size: {Math.round(compressedSize / 1024)} KB
            </p>

            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-success" onClick={onCompress} disabled={isCompressing}>
                {isCompressing ? "Compressing..." : "Compress"}
              </button>

              <button className="btn btn-danger" onClick={onReset}>
                Reset
              </button>
            </div>
          </>
        )}
      </div>

      <div className="col-lg-3 text-center">
        {isCompressing ? (
          <Spinner animation="border" />
        ) : hasCompressedImage ? (
          <>
            <Card.Img
              src={compressedUrl}
              alt="Compressed"
              className="image"
              style={{ cursor: "pointer" }}
              onClick={onOpenModal}
            />

            <a href={compressedUrl} download={originalFileName} className="btn btn-success mt-3">
              <FontAwesomeIcon icon={faDownload} className="me-2" />
              Download
            </a>
          </>
        ) : null}
      </div>
    </div>
  );
}