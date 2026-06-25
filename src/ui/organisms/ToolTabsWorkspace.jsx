import { Suspense } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

export default function ToolTabsWorkspace({
  tabs,
  defaultActiveKey,
}) {
  return (
    <Tabs
      defaultActiveKey={defaultActiveKey}
      id="tool-tabs"
      className="app-tabs"
      justify
      mountOnEnter
      unmountOnExit
    >
      {tabs.map((tab) => (
        <Tab key={tab.key} eventKey={tab.key} title={tab.title}>
          <div className="tab-panel-wrap">
            <Suspense fallback={<div className="tab-loading">Loading...</div>}>
              <tab.Component />
            </Suspense>
          </div>
        </Tab>
      ))}
    </Tabs>
  );
}