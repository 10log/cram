import React from "react";
import WifiIcon from "@mui/icons-material/Wifi";
import { SvgIconProps } from "@mui/material";

export function SourceIcon(props: SvgIconProps) {
  return <WifiIcon transform="rotate(45)" fillOpacity={0.95} {...props} />;
}