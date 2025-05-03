import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import Preview from "./components/Preview";
import { usePlayGroundContext } from "./hooks/usePlayGroundContext";
import classNames from "classnames";
import AntdConfigContextProvider from "./contexts/AntdConfigContext";
import "./index.scss";

export default function ReactPlayground() {
  const { theme } = usePlayGroundContext();

  return (
    <AntdConfigContextProvider>
      <div className={classNames(theme, "wrapper")}>
        <Header />
        <div className={classNames("contentWrapper")}>
          <Allotment defaultSizes={[120, 100]}>
            <Allotment.Pane minSize={0}>
              <CodeEditor />
            </Allotment.Pane>
            <Allotment.Pane minSize={0}>
              <Preview />
            </Allotment.Pane>
          </Allotment>
        </div>
      </div>
    </AntdConfigContextProvider>
  );
}
