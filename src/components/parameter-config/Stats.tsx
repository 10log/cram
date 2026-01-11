import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

export interface Stat {
  name: string;
  value: number | string;
}

export interface StatsProps {
  data: Stat[];
}

export default function Stats(props: StatsProps) {
  return (
    <div className="stats">
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((stat, index) => (
              <TableRow key={stat.name + index} hover>
                <TableCell>{stat.name}</TableCell>
                <TableCell>{stat.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}