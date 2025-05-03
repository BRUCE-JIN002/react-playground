import Editor from "./Editor";
import FileNameList from "./FileNameList";
import { usePlayGroundContext } from "../../hooks/usePlayGroundContext";
import _ from "lodash";
import styles from "./index.module.scss";

export default function CodeEditor() {
  const { files, theme, selectedFileName, setFiles } = usePlayGroundContext();
  const file = files.find((file) => file.name === selectedFileName)!;

  const onEditorChange = _.debounce((value?: string) => {
    const index = _.findIndex(
      files,
      (currentFile) => currentFile.name === file.name
    );
    if (index > -1) {
      files[index] = {
        ...files[index],
        value: value!
      };
    }
    setFiles([...files]);
  }, 500);

  return (
    <div className={styles.editorWrapper}>
      <FileNameList />
      <div className={styles.editor}>
        <Editor file={file} theme={theme!} onChange={onEditorChange} />
      </div>
    </div>
  );
}
