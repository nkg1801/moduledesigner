import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useEditorStore } from "../store/editorStore";

export default function ProjectExplorer() {

	const hmis =
		useEditorStore(
			(state) => state.hmis
		);

	const selectedHmiId =
		useEditorStore(
			(state) => state.selectedHmiId
		);

	const selectHmi =
		useEditorStore(
			(state) => state.selectHmi
		);

	const renameHmi =
		useEditorStore(
			(state) =>
				state.renameHmi
		);

	const deleteHmi =
		useEditorStore(
			(state) =>
				state.deleteHmi
		);

	const duplicateHmi =
		useEditorStore(
			(state) =>
				state.duplicateHmi
		);

	const [contextMenu, setContextMenu] =
		useState<{
			mouseX: number;
			mouseY: number;
			hmiId: string;
		} | null>(null);

	return (
		<Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
				}}
			>
				<FolderIcon fontSize="small" />
				Demo Project
			</Box>

			<Box sx={{ ml: 1 }}>

				<Typography
					sx={{
						fontWeight: 500,
					}}
				>
					▼ HMI
				</Typography>

				{hmis.map((hmi) => (

					<Box
						key={hmi.id}
						onClick={() =>
							selectHmi(hmi.id)
						}

						onContextMenu={(e) => {

							e.preventDefault();

							setContextMenu({
								mouseX: e.clientX,
								mouseY: e.clientY,
								hmiId: hmi.id,
							});
						}}

						onDoubleClick={() => {

							const newName =
								prompt(
									"HMI Name",
									hmi.name
								);

							if (
								newName &&
								newName.trim()
							) {
								renameHmi(
									hmi.id,
									newName.trim()
								);
							}
						}}

						sx={{
							ml: 2,
							mt: 0.5,
							p: 0.5,

							cursor: "pointer",

							borderRadius: 1,

							backgroundColor:
								selectedHmiId === hmi.id ? "#1976d2" : "transparent",

							color:
								selectedHmiId === hmi.id ? "white" : "inherit",

							"&:hover": {
								backgroundColor:
									selectedHmiId ===
										hmi.id
										? "#1976d2"
										: "#eeeeee",
							},
						}}
					>
						📄 {hmi.name}
					</Box>

				))}
			</Box>

			<Menu
				open={contextMenu !== null}
				onClose={() =>
					setContextMenu(null)
				}
				anchorReference="anchorPosition"
				anchorPosition={
					contextMenu
						? {
							top:
								contextMenu.mouseY,
							left:
								contextMenu.mouseX,
						}
						: undefined
				}
			>
				<MenuItem
					onClick={() => {

						if (!contextMenu) {
							return;
						}

						const hmi =
							hmis.find(
								(h) =>
									h.id ===
									contextMenu.hmiId
							);

						if (!hmi) {
							return;
						}

						const newName = prompt("HMI Name",hmi.name);

						if (newName && newName.trim()) {
							renameHmi(hmi.id, newName.trim());
						}

						setContextMenu(null);
					}}
				>
					Rename
				</MenuItem>

				<MenuItem
					onClick={() => {

						if (!contextMenu) {
							return;
						}

						duplicateHmi(contextMenu.hmiId);
						setContextMenu(null);
					}}
				>
					Duplicate
				</MenuItem>

				<MenuItem
					onClick={() => {

						if (!contextMenu) {
							return;
						}

						if (hmis.length === 1) {
							alert(
								"At least one HMI must exist."
							);

							setContextMenu(null);
							return;
						}

						const hmi =
							hmis.find(
								(h) =>
									h.id ===
									contextMenu.hmiId
							);

						if (!hmi) {
							return;
						}

						const confirmed =
							window.confirm(
								`Delete ${hmi.name}?`
							);

						if (confirmed) {
							deleteHmi(hmi.id);
						}

						setContextMenu(null);
					}}
				>
					Delete
				</MenuItem>
			</Menu>
		</Box>
	);
}