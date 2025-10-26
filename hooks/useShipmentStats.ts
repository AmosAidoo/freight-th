import { useMemo } from "react";
import { ShipmentRow, ShipmentStats } from "@/types";

export function useShipmentStats(rows: ShipmentRow[]): ShipmentStats {
	return useMemo(() => {
		const totalRows = rows.length;
		const errorCount = rows.filter(r => r._validationErrors).length;
		const validCount = rows.filter(r => !r._validationErrors).length;
		const processedRows = rows.filter(r => r._status === "success");
		const processedCount = processedRows.length;

		const totalEmissions = processedRows.reduce((sum, r) => sum + (r._emissions || 0), 0);
		const avgEmissions = processedCount > 0 ? totalEmissions / processedCount : 0;

		const emissionsByMode = processedRows.reduce((acc, r) => {
			if (r._emissions && r.mode) {
				const modeKey = r.mode.toUpperCase();
				acc[modeKey] = (acc[modeKey] || 0) + r._emissions;
			}
			return acc;
		}, {} as Record<string, number>);

		const emissionsByRoute = processedRows.reduce((acc, r) => {
			if (r.origin_address && r.destination_address && r._emissions) {
				const key = `${r.origin_address} → ${r.destination_address}`;
				acc[key] = (acc[key] || 0) + r._emissions;
			}
			return acc;
		}, {} as Record<string, number>);

		let topRoute = null;
		if (Object.keys(emissionsByRoute).length > 0) {
			topRoute = Object.entries(emissionsByRoute).reduce(
				(a, b) => (b[1] > a[1] ? b : a)
			);
		}

		return {
			totalRows,
			errorCount,
			validCount,
			processedCount,
			totalEmissions,
			avgEmissions,
			emissionsByMode,
			topRoute: topRoute ? { route: topRoute[0], emissions: topRoute[1] } : null,
		};
	}, [rows]);
}
