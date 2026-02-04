import React, { useState, useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";

export interface ParametersPanelProps {
  // messenger prop kept for compatibility but not used in current implementation
  messenger?: unknown;
}

interface CellData {
  value: string;
  error: boolean;
}

interface ColumnData {
  name: string;
  error: boolean;
}

// Styles
const tableCellSx: SxProps<Theme> = {
  p: 0.5,
  borderRight: '1px solid',
  borderColor: 'divider',
  '&:last-child': {
    borderRight: 'none',
  },
};

const headerCellSx: SxProps<Theme> = {
  ...tableCellSx,
  fontWeight: 600,
  backgroundColor: 'grey.100',
};

const editableTextFieldSx: SxProps<Theme> = {
  '& .MuiInputBase-input': {
    p: 0.5,
    fontSize: '0.875rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: '1px solid',
    borderColor: 'primary.main',
  },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: '1px solid',
    borderColor: 'primary.main',
  },
};

interface EditableCellProps {
  value: string;
  error?: boolean;
  onChange: (value: string) => void;
  onConfirm: (value: string) => void;
}

function EditableCell({ value, error, onChange, onConfirm }: EditableCellProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onConfirm(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onConfirm(localValue);
    } else if (e.key === 'Escape') {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  // Sync local value when prop changes (unless editing)
  React.useEffect(() => {
    if (!isEditing) {
      setLocalValue(value);
    }
  }, [value, isEditing]);

  return (
    <TextField
      value={localValue}
      onChange={handleChange}
      onFocus={() => setIsEditing(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      error={error}
      size="small"
      fullWidth
      sx={editableTextFieldSx}
    />
  );
}

interface EditableHeaderProps {
  name: string;
  error?: boolean;
  onChange: (name: string) => void;
  onConfirm: (name: string) => void;
}

function EditableHeader({ name, error, onChange, onConfirm }: EditableHeaderProps) {
  const [localName, setLocalName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setLocalName(newName);
    onChange(newName);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onConfirm(localName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onConfirm(localName);
    } else if (e.key === 'Escape') {
      setLocalName(name);
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
    if (!isEditing) {
      setLocalName(name);
    }
  }, [name, isEditing]);

  return (
    <TextField
      value={localName}
      onChange={handleChange}
      onFocus={() => setIsEditing(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      error={error}
      size="small"
      fullWidth
      sx={{
        ...editableTextFieldSx,
        '& .MuiInputBase-input': {
          p: 0.5,
          fontSize: '0.875rem',
          fontWeight: 600,
        },
      }}
    />
  );
}

// Helper to create data key
const dataKey = (rowIndex: number, columnIndex: number) => `${rowIndex}-${columnIndex}`;

// Validation function - only allows letters
const isValidValue = (value: string) => /^[a-zA-Z]*$/.test(value);

export function ParametersPanel(_props: ParametersPanelProps) {
  const [columns, setColumns] = useState<ColumnData[]>([
    { name: "Please", error: false },
    { name: "Rename", error: false },
    { name: "Me", error: false },
  ]);

  const [cellData, setCellData] = useState<Record<string, CellData>>({
    "1-1": { value: "editable", error: false },
    "3-1": { value: "validation 123", error: true },
  });

  const numRows = 7;

  // Column handlers
  const handleColumnChange = useCallback((index: number, name: string) => {
    setColumns(prev => {
      const newColumns = [...prev];
      newColumns[index] = { name, error: !isValidValue(name) };
      return newColumns;
    });
  }, []);

  const handleColumnConfirm = useCallback((index: number, name: string) => {
    setColumns(prev => {
      const newColumns = [...prev];
      newColumns[index] = { name, error: !isValidValue(name) };
      return newColumns;
    });
  }, []);

  // Cell handlers
  const handleCellChange = useCallback((rowIndex: number, colIndex: number, value: string) => {
    const key = dataKey(rowIndex, colIndex);
    setCellData(prev => ({
      ...prev,
      [key]: { value, error: !isValidValue(value) },
    }));
  }, []);

  const handleCellConfirm = useCallback((rowIndex: number, colIndex: number, value: string) => {
    const key = dataKey(rowIndex, colIndex);
    setCellData(prev => ({
      ...prev,
      [key]: { value, error: !isValidValue(value) },
    }));
  }, []);

  // Get cell value and error state
  const getCell = (rowIndex: number, colIndex: number): CellData => {
    const key = dataKey(rowIndex, colIndex);
    return cellData[key] || { value: "", error: false };
  };

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col, colIndex) => (
              <TableCell key={colIndex} sx={headerCellSx}>
                <EditableHeader
                  name={col.name}
                  error={col.error}
                  onChange={(name) => handleColumnChange(colIndex, name)}
                  onConfirm={(name) => handleColumnConfirm(colIndex, name)}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: numRows }, (_, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((_, colIndex) => {
                const cell = getCell(rowIndex, colIndex);
                return (
                  <TableCell key={colIndex} sx={tableCellSx}>
                    <EditableCell
                      value={cell.value}
                      error={cell.error}
                      onChange={(value) => handleCellChange(rowIndex, colIndex, value)}
                      onConfirm={(value) => handleCellConfirm(rowIndex, colIndex, value)}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Default export for backwards compatibility
export default ParametersPanel;
