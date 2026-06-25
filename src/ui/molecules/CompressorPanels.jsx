export function CompressorHelpPanel() {
  return (
    <div className="help-container">
      <h6>Instructions</h6>
      <ul>
        <li>Upload an image.</li>
        <li>Adjust compression quality.</li>
        <li>Click Compress.</li>
        <li>Download the result.</li>
      </ul>
    </div>
  );
}

export function CompressorHistoryPanel({ history }) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="history-container">
      <h6>Compression History</h6>

      <ul>
        {history.map((item, index) => (
          <li key={`${item.name}-${index}`}>
            <a href={item.link} download={item.name}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}