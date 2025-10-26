import Papa from "papaparse";
import type { RawData, ShipmentRow } from "@/types"

export const parseCSV = (file: File, callback: (rows: RawData[], headers: string[]) => void) => {
	Papa.parse(file, {
		header: true,
		skipEmptyLines: true,
		transformHeader: (header) => header.trim().replace(/\s+/g, "_"),
		complete: (results) => {
			callback(results.data as RawData[], results.meta.fields || []);
		},
		error: () => {
			alert("Error parsing CSV file. Please check the file format.");
		}
	});
};

export const exportResults = (rows: ShipmentRow[]) => {
	const exportData = rows.map(row => ({
		...row._originalData,
		shipment_id: row.shipment_id || "",
		origin_address: row.origin_address || "",
		destination_address: row.destination_address || "",
		mode: row.mode || "",
		weight_kg: row.weight_kg || "",
		co2e_kg: row._emissions || "",
		status: row._status,
		error: row._error || (row._validationErrors ? "Validation Error" : "")
	}));

	const csv = Papa.unparse(exportData);
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `freight_shipment_footprint_${new Date().toISOString()}.csv`;
	a.click();
	URL.revokeObjectURL(url);
};