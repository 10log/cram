import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

const editorContainerSx: SxProps<Theme> = {
  height: "100%",
  width: "100%",
  userSelect: "none",
};

export default function EditorContainer({ children }: { children?: React.ReactNode }) {
  return (
    <Box id="editor-container" sx={editorContainerSx}>
      {children}
    </Box>
  );
}

