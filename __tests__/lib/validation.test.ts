import { describe, it, expect } from "@jest/globals";
import { validateRow } from "@/lib/validation";
import { Shipment, ShipmentMode } from "@/types";

describe("validateRow", () => {
	it("should validate a correct shipment row", () => {
		const validShipment: Shipment = {
			shipment_id: "SH-001",
			origin_address: "123 Main St, NYC",
			destination_address: "456 Oak Ave, LA",
			mode: "air",
			weight_kg: 500
		};

		const result = validateRow(validShipment, 0);

		expect(result._validationErrors).toBeUndefined();
		expect(result._status).toBe("pending");
		expect(result._rowIndex).toBe(0);
	});

	it("should detect missing required fields", () => {
		const invalidShipment: Shipment = {
			shipment_id: "",
			origin_address: "123 Main St",
			destination_address: "",
			mode: "air",
			weight_kg: 500
		};

		const result = validateRow(invalidShipment, 0);

		expect(result._validationErrors).toBeDefined();
		expect(result._validationErrors?.shipment_id).toBe("Required field missing.");
		expect(result._validationErrors?.destination_address).toBe("Required field missing.");
	});

	it("should normalize and validate transport modes", () => {
		const testCases = [
			{ input: "AIR", expected: "air", valid: true },
			{ input: "  sea  ", expected: "sea", valid: true },
			{ input: "Road", expected: "road", valid: true },
			{ input: "TRUCK", expected: "truck", valid: false },
			{ input: "plane", expected: "plane", valid: false }
		];

		testCases.forEach(({ input, expected, valid }) => {
			const shipment: Shipment = {
				shipment_id: "SH-001",
				origin_address: "123 Main St",
				destination_address: "456 Oak Ave",
				mode: input as ShipmentMode,
				weight_kg: 500
			};

			const result = validateRow(shipment, 0);

			expect(result.mode).toBe(expected);
			if (valid) {
				expect(result._validationErrors?.mode).toBeUndefined();
			} else {
				expect(result._validationErrors?.mode).toContain("Must be one of:");
			}
		});
	});

	it("should validate weight_kg as positive number", () => {
		const testCases = [
			{ weight: 500, valid: true },
			{ weight: 0.1, valid: true },
			{ weight: 0, valid: false },
			{ weight: -100, valid: false },
			{ weight: NaN, valid: false },
			{ weight: "500", valid: true },
		];

		testCases.forEach(({ weight, valid }) => {
			const shipment: Shipment = {
				shipment_id: "SH-001",
				origin_address: "123 Main St",
				destination_address: "456 Oak Ave",
				mode: "air",
				weight_kg: weight as number
			};

			const result = validateRow(shipment, 0);

			if (valid) {
				expect(result._validationErrors?.weight_kg).toBeUndefined();
			} else {
				expect(result._validationErrors?.weight_kg).toBe("Must be a positive number (> 0).");
			}
		});
	});
});