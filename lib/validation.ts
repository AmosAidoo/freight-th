import { RawData, Shipment, ShipmentMode, ShipmentRow } from "@/types";
import { VALID_MODES } from "./constants";

export const validateRow = (row: Shipment, index: number): ShipmentRow => {
	const errors: Record<string, string> = {};
	const data: Partial<Shipment> = {};

	const shipmentId = String(row.shipment_id || "").trim();
	if (!shipmentId) {
		errors.shipment_id = "Required field missing.";
	}
	data.shipment_id = shipmentId;

	const origin = String(row.origin_address || "").trim();
	if (!origin) {
		errors.origin_address = "Required field missing.";
	}
	data.origin_address = origin;

	const destination = String(row.destination_address || "").trim();
	if (!destination) {
		errors.destination_address = "Required field missing.";
	}
	data.destination_address = destination;

	const mode = String(row.mode || "").toLowerCase().trim();
	if (!VALID_MODES.includes(mode)) {
		errors.mode = `Must be one of: ${VALID_MODES.join(", ")}.`;
	}
	data.mode = mode as ShipmentMode;

	const weight = parseFloat(`${row.weight_kg}`);
	if (isNaN(weight) || weight <= 0) {
		errors.weight_kg = "Must be a positive number (> 0).";
	}
	data.weight_kg = weight;

	return {
		...data,
		_rowIndex: index,
		_status: "pending",
		_validationErrors: Object.keys(errors).length > 0 ? errors : undefined,
	};
};