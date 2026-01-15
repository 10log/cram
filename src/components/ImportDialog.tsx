// @ts-nocheck
import React, { useState } from "react";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper
} from "@mui/material";

import { messenger, on } from '../messenger';
import { useAppStore } from '../store/app-store';
import { pickProps } from '../common/helpers';
import { mmm_dd_yyyy } from "../common/dayt";
import FileTypes from '../common/file-type';
import { useShallow } from "zustand/react/shallow";



export const ACCEPTED_FILE_TYPES = [
    ""
]

export enum DROP_ALLOWED {
    NO = 0,
    IDK = 1,
    YES = 2
}

const backgroundColors = [
	"rgba(255,0,0,.2)",
	"rgba(0,0,0,0)",
	"rgba(0,255,0,.2)"
];

export interface FileWithCheckbox{
	file: File;
	checked: boolean;
}


const upload = (callback: (files?: File[]) => void) => {
  const input = (document.querySelector("#temp-file-import") as HTMLInputElement) || document.createElement("input");
  input.type = "file";
  input.setAttribute("style", "display: none;");
  input.setAttribute("id", "temp-file-import");
  document.body.appendChild(input);
  input.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target && target.files) {
      const files = Array.from(target.files) as File[];
      callback(files);
    }
    input.remove();
  });
  input.click();
}



export default function ImportDialog() {
	const [dropAllowed, setDropAllowed] = useState(DROP_ALLOWED.IDK);
	const [filelist, setFilelist] = useState([] as File[]);
  const { importDialogVisible, set } = useAppStore(useShallow(store => pickProps(["importDialogVisible", "set"], store)));

	const handleClose = () => {
		set(store => { store.importDialogVisible = false; });
	};

	const handleImport = () => {
		messenger.postMessage("IMPORT_FILE", filelist);
		setFilelist([] as File[]);
		handleClose();
	};

	return (
		<Dialog
			open={importDialogVisible}
			onClose={handleClose}
			transitionDuration={0}
			maxWidth="sm"
			fullWidth
			sx={{
				'& .MuiDialog-paper': {
					minWidth: '350px'
				}
			}}
		>
			<DialogTitle>Import</DialogTitle>
			<DialogContent
				onDragLeave={() => setDropAllowed(DROP_ALLOWED.IDK)}
				onDragOver={(e: React.DragEvent<HTMLElement>) => {
					const { types, items } = e.dataTransfer;
					let yes = true;
					for (let i = 0; i < types.length; i++) {
						yes = yes && items[i].kind === "file";
					}
					setDropAllowed(yes ? DROP_ALLOWED.YES : DROP_ALLOWED.NO);
					e.stopPropagation();
					e.preventDefault();
				}}
				onDrop={(e: React.DragEvent<HTMLDivElement>) => {
					const { files } = e.dataTransfer;
					let filearray = Array.from(files);
					setFilelist(filearray);
					setDropAllowed(DROP_ALLOWED.IDK);
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<div
					style={{ backgroundColor: backgroundColors[dropAllowed] }}
					className={"drop-zone"}
					onClick={() =>
						upload((files) => {
							setFilelist(files!);
							setDropAllowed(DROP_ALLOWED.IDK);
						})
					}
				>
					<div
						style={{
							color: "gray",
							fontSize: "12pt",
							width: "100%",
							textAlign: "center"
						}}
					>
						Drag files or click to browse
					</div>
				</div>
				{filelist.length > 0 && (
					<TableContainer component={Paper} sx={{ mt: 2 }}>
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell>.ico</TableCell>
									<TableCell>name</TableCell>
									<TableCell>last-modified</TableCell>
									<TableCell>valid</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{filelist.map((file, i) => {
									const ext = file.name.split(".").slice(-1)[0];
									return (
										<TableRow key={file.name + i} hover>
											<TableCell>
												<div
													className={
														"icon " +
														(FileTypes.assoc[ext] || FileTypes.ICONS.FILE)
													}
												/>
											</TableCell>
											<TableCell>{file.name}</TableCell>
											<TableCell>{mmm_dd_yyyy(file.lastModified)}</TableCell>
											<TableCell>
												{FileTypes.allowed[ext] ? "✓" : "x"}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button
					variant="contained"
					color="primary"
					disabled={filelist.length === 0}
					onClick={handleImport}
				>
					Import
				</Button>
			</DialogActions>
		</Dialog>
	);
}

declare global {
	interface EventTypes {
		SHOW_IMPORT_DIALOG: boolean;
	}
}

on("SHOW_IMPORT_DIALOG", (visible) => {
	useAppStore.getState().set(store => {
		store.importDialogVisible = visible;
	});
})


// export const SaveDialog = () => {


//   return (
//     <ImportDialog

//     />

//   );

// }

// export default SaveDialog;