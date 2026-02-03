import React from "react";
import Box from "@mui/material/Box";

interface Props {
  value: string;
  onChange: ({ value }: { value: string }) => void;
  options: { value: string; label: string }[];
}

export const PropertyRowSelect = ({ value, onChange, options }: Props) => {
  return (
    <Box
      component="select"
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange({ value: e.currentTarget.value })}
      value={value}
    >
      {options.map(({ value, label }, i) => (
        <option value={value} key={`${value}-${label}-${i}`}>
          {label}
        </option>
      ))}
    </Box>
  );
};
