import { useEffect, useState } from "react";
import { compress } from "image-conversion";
import { Button, Modal } from "react-bootstrap";

import CompressorHeader from "../molecules/CompressorHeader";
import CompressorWorkspace from "../molecules/CompressorWorkspace";
import { CompressorHelpPanel, CompressorHistoryPanel } from "../molecules/CompressorPanels";

import "./CompressorTool.scss";

export default function CompressorTool() {
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
      <CompressorHeader
        onToggleHelp={() => setShowHelp((prev) => !prev)}
        onToggleHistory={() => setShowHistory((prev) => !prev)}
      />

      {showHelp && <CompressorHelpPanel />}

      {showHistory && <CompressorHistoryPanel history={history} />}

      <CompressorWorkspace
        hasImage={hasImage}
        originalUrl={originalUrl}
        quality={quality}
        onQualityChange={setQuality}
        originalSize={originalSize}
        compressedSize={compressedSize}
        onUpload={handleUpload}
        onCompress={handleCompress}
        onReset={handleReset}
        isCompressing={isCompressing}
        hasCompressedImage={hasCompressedImage}
        compressedUrl={compressedUrl}
        onOpenModal={() => setShowModal(true)}
        originalFileName={originalFile?.name}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Body className="text-center">
          <img src={compressedUrl} alt="Compressed" className="image" />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}