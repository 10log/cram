import React from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

const menuItemTextSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
};

const hotkeyContainerSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
};

const hotkeySx: SxProps<Theme> = {
  minWidth: "10px",
};

export interface MenuItemTextProps {
  text: string;
  hotkey: string[];
}

export default function MenuItemText(props: MenuItemTextProps) {
  const id = props.hotkey.join("");
  return (
    <Box sx={menuItemTextSx}>
      <div>{props.text}</div>
      <Box sx={hotkeyContainerSx}>
        {props.hotkey.map((key, i) => (
          <Box component="span" key={id + props.text + String(i)} sx={hotkeySx}>
            {key}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
