import { ConfigProvider } from "antd";
import { usePlayGroundContext } from "../hooks/usePlayGroundContext";
import { PropsWithChildren } from "react";

const AntdConfigContextProvider = ({ children }: PropsWithChildren) => {
  const { theme } = usePlayGroundContext();

  return (
    <ConfigProvider
      theme={{
        token:
          theme === "dark"
            ? {
                colorPrimary: "#478ba3",
                colorPrimaryHover: "skyblue",
                colorBgElevated: "#2d2d2d",
                colorText: "#fff",
                fontSize: 12
              }
            : { fontSize: 12 },
        components: {
          Switch: {
            colorPrimary: "skyblue",
            colorPrimaryHover: "#6cb6d1"
          }
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdConfigContextProvider;
