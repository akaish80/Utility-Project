//App.js
import './App.css';
import CompressorComp from './Components/Compressor';
// import CompressorComp 
    // from "./Components/Compressor";
import 'bootstrap/dist/css/bootstrap.css';
import PdfSplitter from './pdfextracter';
import PdfMerger from './pdfextracter/PdfMerger';
import DocToMarkdown from './Components/DocToMarkdown';

function App() {
    return (
        <>
        <CompressorComp />
        <PdfSplitter />
        <PdfMerger />
        <DocToMarkdown />
        </>
    );
}
export default App;