import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useEditorStore } from "../store/editorStore";
import EngineeringIcon from "@mui/icons-material/Engineering";

export default function ProjectExplorer() {
	
	const hmis = useEditorStore((state) => state.hmis);
	const selectedHmiId = useEditorStore((state) => state.selectedHmiId);
	const selectHmi = useEditorStore((state) => state.selectHmi);
	const renameHmi = useEditorStore((state) =>state.renameHmi);
	const deleteHmi = useEditorStore((state) => state.deleteHmi);
	const duplicateHmi = useEditorStore((state) => state.duplicateHmi);
	const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; hmiId: string; } | null>(null);
	const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
	const services = useEditorStore((state) => state.services);
	const addService = useEditorStore((state) => state.addService);
	const selectedServiceId = useEditorStore((state) =>state.selectedServiceId);
	const selectService =useEditorStore((state) =>state.selectService);
	const selectedServiceStateId =useEditorStore((state) =>state.selectedServiceStateId);
	const selectServiceState =useEditorStore((state) =>state.selectServiceState);
	const toggleService = (serviceId: string) => {
		setExpandedServices((prev) => ({
			...prev,
			[serviceId]: !prev[serviceId],
		}));
	};

	const openServiceEditor =
		useEditorStore(
			(state) =>
				state.openServiceEditor
		);

	console.log(
		"render services count",
		services.length,
		services
	);

	return (
		<Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
				}}>
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

							setContextMenu({mouseX: e.clientX,mouseY: e.clientY,hmiId: hmi.id,});
						}}

						onDoubleClick={() => {
							const newName = prompt( "HMI Name", hmi.name);

							if (newName &&newName.trim()) {
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

			<Box
				sx={{
					ml: 1,
					mt: 2,
				}}
			>

				<Typography
					sx={{
						fontWeight: 500,
						mt: 2,
						cursor: "pointer",
					}}
					onContextMenu={(e) => {

						e.preventDefault();
						const name = prompt("Service Name");
						if (name && name.trim()) {
							addService(name.trim());
							console.log("services count", services.length, services);
						}
					}}

					onDoubleClick={() => {
						openServiceEditor(
							service.id
						);
					}}
				>
					▼ Services
				</Typography>

				{services.map((service) => (

					<Box key={service.id}>

						{/* Service */}

						<Box
							onClick={() => {
								selectService(service.id);
								toggleService(service.id);
							}}

							onDoubleClick={() => {
								openServiceEditor(service.id);
							}}

							sx={{
								ml: 2,
								mt: 0.5,
								p: 0.5,

								display: "flex",
								alignItems: "center",
								gap: 1,

								cursor: "pointer",

								borderRadius: 1,

								backgroundColor:
									selectedServiceId ===
										service.id
										? "#1976d2"
										: "transparent",

								color:
									selectedServiceId === service.id ? "white" : "inherit","&:hover": {
									backgroundColor: selectedServiceId === service.id ? "#1976d2" : "#eeeeee",
								},
							}}
						>
							{expandedServices[service.id] ? "▼" : "▶"}

							<EngineeringIcon fontSize="small" />
							{service.name}
						</Box>

						{expandedServices[service.id] &&
							service.states.map((state) => (

								<Box
									key={state.id}
									onClick={() => {
										selectService(service.id);
										selectServiceState(state.id);
									}}
									sx={{
										ml: 5,
										mt: 0.25,
										p: 0.25,

										cursor: "pointer",

										borderRadius: 1,

										backgroundColor:
											selectedServiceStateId === state.id
												? "#1976d2"
												: "transparent",

										color:
											selectedServiceStateId === state.id
												? "white"
												: "inherit",

										"&:hover": {
											backgroundColor:
												selectedServiceStateId === state.id
													? "#1976d2"
													: "#eeeeee",
										},
									}}
								>
									▌ {state.name}
								</Box>

							))}
					</Box>
				))}
			</Box>

			<Box
				sx={{
					ml: 1,
					mt: 2,
				}}
			>

				<Typography
					sx={{
						fontWeight: 500,
						mt: 2,
						cursor: "pointer",
					}}
					onContextMenu={(e) => {

						e.preventDefault();
						const name = prompt("Place holder for tags");
						if (name && name.trim()) {
							addService(name.trim());
						}
					}}
				>
					▼ Tags
				</Typography>
			</Box>

			<Box
				sx={{
					ml: 1,
					mt: 2,
				}}
			>

				<Typography
					sx={{
						fontWeight: 500,
						mt: 2,
						cursor: "pointer",
					}}
					onContextMenu={(e) => {

						e.preventDefault();
						const name = prompt("Place holder");
						if (name && name.trim()) {
							addService(name.trim());
						}
					}}


				>
					▼ Alarms
				</Typography>
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