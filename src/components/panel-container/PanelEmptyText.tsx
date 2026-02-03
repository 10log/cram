import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

const panelEmptyTextSx: SxProps<Theme> = {
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#b4b8bb",
};

export function PanelEmptyText({ children }: { children?: React.ReactNode }) {
  return <Box sx={panelEmptyTextSx}>{children}</Box>;
}

export default PanelEmptyText;
