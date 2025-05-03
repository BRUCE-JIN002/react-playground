import { editor } from "monaco-editor";
import MonacoEditor, { EditorProps, Monaco } from "@monaco-editor/react";
import { createATA } from "./ata";
import { Theme } from "../../../contexts/PlaygroundContext";
import { usePlayGroundContext } from "../../../hooks/usePlayGroundContext";
import styles from "./index.module.scss";

export interface EditorFile {
  name: string;
  value: string;
  language: string;
}

interface Props {
  theme: Theme;
  file: EditorFile;
  onChange?: EditorProps["onChange"];
  options?: editor.IStandaloneEditorConstructionOptions;
}

export default function Editor(props: Props) {
  const { file, theme, onChange, options } = props;
  const { showMinMap } = usePlayGroundContext();

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    //快捷键格式化代码
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
    //配置编译选项
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true
    });

    const ata = createATA((code, path) => {
      //配置路径提示，获取类型之后用 addExtraLib 添加到 ts 里
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        code,
        `file://${path}`
      );
    });
    //内容改变获取类型
    editor.onDidChangeModelContent(() => {
      ata(editor.getValue());
    });
    //初始获取一次类型
    ata(editor.getValue());
  };

  return (
    <MonacoEditor
      loading={<div className={styles.loader} />}
      height="100%"
      path={file?.name}
      language={file?.language}
      value={file?.value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      theme={`vs-${theme}`}
      options={{
        fontSize: 14,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: showMinMap,
          size: "proportional"
        },
        overviewRulerBorder: false,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6
        },
        ...options
      }}
    />
  );
}
