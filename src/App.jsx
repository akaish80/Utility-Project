import { Suspense, lazy } from 'react';

import './App.scss';
import ToolTabsWorkspace from './ui/organisms/ToolTabsWorkspace';

const CompressorTool = lazy(() => import('./ui/organisms/CompressorTool'));
const PngToPdfTool = lazy(() => import('./ui/organisms/PngToPdfTool'));
const PdfSplitterTool = lazy(() => import('./ui/organisms/PdfSplitterTool'));
const PdfMergerTool = lazy(() => import('./ui/organisms/PdfMergerTool'));
const DocToMarkdownTool = lazy(() => import('./ui/organisms/DocToMarkdownTool'));

const TOOL_TABS = [
  {
    key: 'compressor',
    title: 'Image Compressor',
    Component: CompressorTool,
  },
  {
    key: 'png-to-pdf',
    title: 'PNG to PDF',
    Component: PngToPdfTool,
  },
  {
    key: 'pdf-splitter',
    title: 'PDF Splitter',
    Component: PdfSplitterTool,
  },
  {
    key: 'pdf-merger',
    title: 'PDF Merger',
    Component: PdfMergerTool,
  },
  {
    key: 'markdown',
    title: 'PDF / Word to Markdown',
    Component: DocToMarkdownTool,
  },
];

function App() {
  return (
    <main className="app-shell">
      <Suspense fallback={<div className="app-loading">Loading tool...</div>}>
        <ToolTabsWorkspace tabs={TOOL_TABS} defaultActiveKey="compressor" />
      </Suspense>
    </main>
  );
}
export default App;