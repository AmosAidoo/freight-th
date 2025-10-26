export type ShipmentMode = "air" | "sea" | "road" | "rail";

export interface Shipment {
	shipment_id: string;
	origin_address: string;
	destination_address: string;
	mode: ShipmentMode;
	weight_kg: number;
}

export interface ShipmentRow extends Partial<Shipment> {
	_rowIndex: number;
	_status: "pending" | "processing" | "success" | "error";
	_emissions?: number;
	_error?: string;
	_validationErrors?: Record<string, string>;
	_originalData: RawData;
}

export interface ColumnMapping {
	[key: string]: string; // key is internal field (shipment_id), value is uploaded header
}

export interface IntermodalFreightResponse {
	co2e: number;
	hub_equipment_co2e: number;
	vehicle_operation_co2e: number;
	vehicle_energy_provision_co2e: number;
	co2e_unit: string;
	co2e_calculation_method: string;
	cargo_tonnes: number;
	distance_km: number;
	route: Route[];
}

export interface Route {
	type: string;
	co2e: number;
	co2e_unit: string;
	co2e_calculation_method: string;
	source_trail: Sourcetrail[];
	name?: string;
	confidence_score: number | null;
	vehicle_operation_co2e?: number;
	vehicle_energy_provision_co2e?: number;
	transport_mode?: string;
	distance_km?: number;
	notices?: Notice[];
}

export interface Notice {
	message: string;
	code: string;
	severity: string;
}

export interface Sourcetrail {
	data_category?: string;
	name: string;
	source: string;
	source_dataset: string;
	year?: string;
	region: string;
	region_name: string;
	id?: string;
}

export interface ClimatiqApiError {
	error: string;
	error_code: string | null;
	message: string;
}

export interface ShipmentStats {
	totalRows: number;
	errorCount: number;
	validCount: number;
	processedCount: number;
	totalEmissions: number;
	avgEmissions: number;
	emissionsByMode: Record<string, number>;
	topRoute: {
		route: string;
		emissions: number;
	} | null;
}

export type RawData = Record<string, unknown>;

export interface ParsedCsv {
	data: RawData[];
	headers: string[];
	originalFile: File | null
} 