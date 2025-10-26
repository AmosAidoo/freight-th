import { ClimatiqApiError, IntermodalFreightResponse, ShipmentRow } from "@/types";
import { NextResponse } from "next/server";

const CLIMATIQ_API_KEY = process.env.CLIMATIQ_API_KEY!;
const CLIMATIQ_FREIGHT_URL = "https://api.climatiq.io/freight/v3/intermodal";

async function processShipment(shipment: ShipmentRow) {
	const response = await fetch(CLIMATIQ_FREIGHT_URL, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			route: [
				{ location: { query: shipment.origin_address } },
				{ transport_mode: shipment.mode },
				{ location: { query: shipment.destination_address } },
			],
			cargo: {
				weight: shipment.weight_kg,
				weight_unit: "kg",
			},
		}),
	});

	if (!response.ok) {
		const err: ClimatiqApiError = await response.json();
		return Promise.reject({ rowIndex: shipment._rowIndex, ...err })
	}

	const data: IntermodalFreightResponse = await response.json();
	return { rowIndex: shipment._rowIndex, ...data };
}

export async function POST(req: Request) {
	const { shipments } = await req.json();

	if (!Array.isArray(shipments)) {
		return NextResponse.json({
			successes: [],
			failures: [
				{
					error: "bad_request",
					message: "Invalid payload, expected shipments array",
				}],
		});
	}

	const results = await Promise.allSettled(
		shipments.map(shipment => processShipment(shipment))
	);

	const successes = results
		.filter(r => r.status === "fulfilled")
		.map((r) => r.value as IntermodalFreightResponse);

	const failures = results
		.filter(r => r.status === "rejected")
		.map(r => r.reason as ClimatiqApiError);

	return NextResponse.json({
		successes,
		failures,
	});
}
