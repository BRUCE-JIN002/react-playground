import { useCallback, useEffect, useRef, useState } from "react";
import { usePlayGroundContext } from "../../hooks/usePlayGroundContext";
import iframeRaw from "./iframe.html?raw";
import { Message } from "../Message";
import CompilerWorker from "./compiler.worker?worker";
import _ from "lodash";
import { IMPORT_MAP_FILE_NAME } from "../../files";

interface MessageData {
  data: {
    type: string;
    message: string;
  };
}

export default function Preview() {
  const { files, theme } = usePlayGroundContext();
  const [compiledCode, setCompiledCode] = useState("");
  const [error, setError] = useState("");

  const compilerWorkerRef = useRef<Worker>();

  useEffect(() => {
    if (!compilerWorkerRef.current) {
      compilerWorkerRef.current = new CompilerWorker();
      compilerWorkerRef.current.addEventListener("message", ({ data }) => {
        if (data.type === "COMPILED_CODE") {
          setCompiledCode(data.data);
        } else {
          console.warn("error", data);
        }
      });
    }
  }, []);

  useEffect(() => {
    const fn = _.debounce(() => {
      compilerWorkerRef.current?.postMessage(files);
    }, 300);
    fn();
  }, [files]);

  const getIframeUrl = useCallback(() => {
    const importMap = files.find(
      (file) => file.name === IMPORT_MAP_FILE_NAME
    )?.value;
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">${importMap}</script>`
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `<script type="module" id="appSrc">${compiledCode}</script>
        <script>
          document.body.classList.add("${theme}");
        </script>
        `
      );
    return URL.createObjectURL(new Blob([res], { type: "text/html" }));
  }, [compiledCode, files, theme]);

  useEffect(() => {
    setIframeUrl(getIframeUrl());
  }, [compiledCode, getIframeUrl]);

  const [iframeUrl, setIframeUrl] = useState(getIframeUrl());

  const handleMessage = (msg: MessageData) => {
    const { type, message } = msg.data;
    if (type === "ERROR") {
      setError(message);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <iframe
        src={iframeUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          padding: 0,
          backgroundColor: theme === "dark" ? "#1a1a1a" : "#fff"
        }}
      />
      <Message type="error" content={error} />
    </div>
  );
}
