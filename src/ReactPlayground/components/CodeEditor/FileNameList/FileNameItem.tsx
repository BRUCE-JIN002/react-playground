import React, { useEffect, useRef, useState } from "react";

import classnames from "classnames";
import styles from "./index.module.scss";
import { Popconfirm, message } from "antd";
import { useDrag, useDrop } from "react-dnd";
import { usePlayGroundContext } from "../../../hooks/usePlayGroundContext";
import { useMount } from "ahooks";
import { useTranslation } from "react-i18next";
import { getFileIcon } from "../../Icon/FileIcons";

interface DragData {
  id: string;
  index: number;
}

export interface FileNameItemProps {
  index: number;
  value: string;
  actived: boolean;
  creating: boolean;
  readonly: boolean;
  onClick: () => void;
  onRemove: () => void;
  onEditComplete: (name: string) => void;
}

export const FileNameItem: React.FC<FileNameItemProps> = (
  props: FileNameItemProps
) => {
  const {
    index,
    value,
    actived = false,
    creating,
    readonly,
    onClick,
    onRemove,
    onEditComplete
  } = props;
  const [name, setName] = useState(value);
  const [editing, setEditing] = useState<boolean>(creating);
  const inputRef = useRef<HTMLInputElement>(null);
  const { swapFile, files } = usePlayGroundContext();
  const ref = useRef(null);
  const { t } = useTranslation();

  const hasExistFile = files.find(
    (item, idx) => item.name === name && idx !== index
  );

  const handleDoubleClick = () => {
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const handleInputDone = () => {
    if (!hasExistFile) {
      setEditing(false);
      onEditComplete(name);
    } else {
      message.error(t("header.fileExists"));
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (creating) {
      inputRef.current?.focus();
    }
  }, [creating]);

  const [, drag] = useDrag({
    type: "File",
    item: {
      id: value,
      index: index
    }
  });

  const [{ isOver }, drop] = useDrop({
    accept: "File",
    drop(item: DragData) {
      swapFile(index, item.index);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });

  useMount(() => {
    drag(ref);
    drop(ref);
  });

  return (
    <div
      ref={ref}
      className={classnames(
        styles["tab-item"],
        { [styles.actived]: actived },
        { [styles.hightlight]: isOver }
      )}
      onClick={onClick}
      onDoubleClick={!readonly ? handleDoubleClick : () => {}}
    >
      {editing ? (
        <input
          ref={inputRef}
          className={classnames(styles["tabs-item-input"], {
            [styles["tabs-item-input-error"]]: hasExistFile
          })}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleInputDone}
          onKeyDown={(e) => {
            e.key === "Enter" && handleInputDone();
          }}
        />
      ) : (
        <>
          <span className={classnames(styles["tabs-item-name"])}>
            {getFileIcon(name)}
            {name}
          </span>
          {!readonly ? (
            <Popconfirm
              title={t("header.confirmToDelete")}
              okText={t("header.confirm")}
              cancelText={t("header.cancel")}
              showCancel={false}
              onConfirm={(e) => {
                e?.stopPropagation();
                onRemove();
              }}
            >
              <span
                className={styles.remove}
                style={{ marginLeft: 5, display: "flex", zIndex: 9 }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24">
                  <line stroke="#999" x1="18" y1="6" x2="6" y2="18"></line>
                  <line stroke="#999" x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
            </Popconfirm>
          ) : null}
        </>
      )}
    </div>
  );
};
