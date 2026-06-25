import { Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faQuestionCircle, faHistory } from "@fortawesome/free-solid-svg-icons";

export default function CompressorHeader({ onToggleHelp, onToggleHistory }) {
  return (
    <Navbar bg="light" className="justify-content-between navbar">
      <Navbar.Brand>
        <FontAwesomeIcon icon={faImage} className="me-2" />
        Image Compressor
      </Navbar.Brand>

      <div>
        <FontAwesomeIcon
          icon={faQuestionCircle}
          className="mx-2"
          role="button"
          onClick={onToggleHelp}
        />

        <FontAwesomeIcon
          icon={faHistory}
          className="mx-2"
          role="button"
          onClick={onToggleHistory}
        />
      </div>
    </Navbar>
  );
}