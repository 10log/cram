import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import type { HRTFSubject } from "../../compute/binaural/hrtf-data";
import { getAvailableSubjects, getThumbnailUrl } from "../../compute/binaural/hrtf-data";

const dialogPaperSx: SxProps<Theme> = {
  bgcolor: "background.paper",
};

const dialogTitleSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const subjectGridSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: 1.5,
  py: 1,
};

const subjectCardSx = (selected: boolean): SxProps<Theme> => ({
  border: 2,
  borderColor: selected ? "primary.main" : "divider",
  borderRadius: 2,
  p: 1,
  cursor: "pointer",
  bgcolor: selected ? "action.selected" : "background.paper",
  transition: "all 0.15s",
  "&:hover": {
    borderColor: selected ? "primary.main" : "text.secondary",
  },
});

const thumbnailContainerSx: SxProps<Theme> = {
  display: "flex",
  gap: 0.5,
  justifyContent: "center",
  mb: 0.75,
};

const thumbnailImgStyle: React.CSSProperties = {
  width: 80,
  height: 100,
  objectFit: "cover",
  borderRadius: 4,
};

export const HRTFSubjectDialog = ({
  open,
  onClose,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const [subjects, setSubjects] = useState<HRTFSubject[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (open) {
      getAvailableSubjects()
        .then(setSubjects)
        .catch((err) => setError(err.message));
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: dialogPaperSx } }}>
      <DialogTitle sx={dialogTitleSx}>
        Select HRTF Subject
        <IconButton onClick={onClose} size="small" aria-label="close">
          &#x2715;
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <Box sx={subjectGridSx}>
          {subjects.map((subject) => (
            <Box
              key={subject.id}
              onClick={() => {
                onSelect(subject.id);
                onClose();
              }}
              sx={subjectCardSx(subject.id === selectedId)}
            >
              <Box sx={thumbnailContainerSx}>
                {subject.thumbnailLeft && (
                  <img
                    src={getThumbnailUrl(subject.thumbnailLeft)}
                    alt={`${subject.id} left ear`}
                    style={thumbnailImgStyle}
                  />
                )}
                {subject.thumbnailRight && (
                  <img
                    src={getThumbnailUrl(subject.thumbnailRight)}
                    alt={`${subject.id} right ear`}
                    style={thumbnailImgStyle}
                  />
                )}
              </Box>
              <Box sx={{ fontWeight: 600, fontSize: 12, textAlign: "center" }}>
                {subject.name}
              </Box>
              <Box sx={{ fontSize: 11, color: "text.secondary", textAlign: "center" }}>
                {subject.description}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default HRTFSubjectDialog;
