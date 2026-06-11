// Components/Compressor.js

import { useState, useEffect } from "react";
import {
  Navbar,
  Card,
  Modal,
  Button,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faUpload,
  faDownload,
  faQuestionCircle,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { compress } from "image-conversion";

import "./Compressor.css";

function CompressorComp() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [compressedUrl, setCompressedUrl] = useState("");

  const [quality, setQuality] = useState(0.8);
  const [isCompressing, setIsCompressing] = useState(false);

  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [history, setHistory] = useState([]);

  const hasImage = Boolean(originalFile);
  const hasCompressedImage = Boolean(compressedUrl);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  const handleUpload = ({ target }) => {
    const file = target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setOriginalFile(file);
    setOriginalUrl(previewUrl);
    setOriginalSize(file.size);

    // Reset previous result
    setCompressedUrl("");
    setCompressedSize(0);
  };

  const handleCompress = async () => {
    if (!originalFile) {
      alert("Please upload an image first.");
      return;
    }

    try {
      setIsCompressing(true);

      const compressedFile = await compress(originalFile, {
        quality,
        width: 800,
        height: 800,
      });

      const url = URL.createObjectURL(compressedFile);

      setCompressedUrl(url);
      setCompressedSize(compressedFile.size);

      setHistory((prev) => [
        ...prev,
        {
          name: originalFile.name,
          link: url,
        },
      ]);
    } catch (error) {
      console.error(error);
      alert("Compression failed.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl("");
    setCompressedUrl("");
    setOriginalSize(0);
    setCompressedSize(0);
    setQuality(0.8);
  };

  return (
    <div className="mainContainer">
      <Navbar
        bg="light"
        className="justify-content-between navbar"
      >
        <Navbar.Brand>
          <FontAwesomeIcon icon={faImage} className="me-2" />
          Image Compressor
        </Navbar.Brand>

        <div>
          <FontAwesomeIcon
            icon={faQuestionCircle}
            className="mx-2"
            role="button"
            onClick={() => setShowHelp((prev) => !prev)}
          />

          <FontAwesomeIcon
            icon={faHistory}
            className="mx-2"
            role="button"
            onClick={() => setShowHistory((prev) => !prev)}
          />
        </div>
      </Navbar>

      {showHelp && (
        <div className="help-container">
          <h6>Instructions</h6>
          <ul>
            <li>Upload an image.</li>
            <li>Adjust compression quality.</li>
            <li>Click Compress.</li>
            <li>Download the result.</li>
          </ul>
        </div>
      )}

      {showHistory && history.length > 0 && (
        <div className="history-container">
          <h6>Compression History</h6>

          <ul>
            {history.map((item, index) => (
              <li key={index}>
                <a href={item.link} download={item.name}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="row mt-4">
        {/* Original Image */}
        <div className="col-lg-3 text-center">
          {hasImage ? (
            <Card.Img
              src={originalUrl}
              alt="Original"
              className="image"
            />
          ) : (
            <div className="upload-placeholder p-5">
              <FontAwesomeIcon
                icon={faUpload}
                size="3x"
              />
            </div>
          )}

          <label
            htmlFor="uploadBtn"
            className="btn btn-primary mt-3"
          >
            <FontAwesomeIcon
              icon={faUpload}
              className="me-2"
            />
            Upload Image
          </label>

          <input
            id="uploadBtn"
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
          />
        </div>

        {/* Controls */}
        <div className="col-lg-6 text-center">
          {hasImage && (
            <>
              <label className="mb-2">
                Quality: {quality}
              </label>

              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={quality}
                className="form-range"
                onChange={(e) =>
                  setQuality(Number(e.target.value))
                }
              />

              <p>
                Original Size:{" "}
                {Math.round(originalSize / 1024)} KB
                <br />
                Compressed Size:{" "}
                {Math.round(compressedSize / 1024)} KB
              </p>

              <div className="d-flex justify-content-center gap-2">
                <button
                  className="btn btn-success"
                  onClick={handleCompress}
                  disabled={isCompressing}
                >
                  {isCompressing
                    ? "Compressing..."
                    : "Compress"}
                </button>

                <button
                  className="btn btn-danger"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </div>

        {/* Compressed Image */}
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
                onClick={() => setShowModal(true)}
              />

              <a
                href={compressedUrl}
                download={originalFile?.name}
                className="btn btn-success mt-3"
              >
                <FontAwesomeIcon
                  icon={faDownload}
                  className="me-2"
                />
                Download
              </a>
            </>
          ) : null}
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
      >
        <Modal.Body className="text-center">
          <Card.Img
            src={compressedUrl}
            alt="Compressed"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CompressorComp;