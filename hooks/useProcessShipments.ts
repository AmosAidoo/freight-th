import { useState, useCallback } from "react";
import { ShipmentRow, IntermodalFreightResponse, ClimatiqApiError } from "@/types";

export const useProcessShipments = (rows: ShipmentRow[], setRows: React.Dispatch<React.SetStateAction<ShipmentRow[]>>) => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [processingProgress, setProcessingProgress] = useState(0);

	const processRows = useCallback(async () => {
		setIsProcessing(true);
		setProcessingProgress(0);
		const validRows = rows.filter(r => !r._validationErrors && r._status !== "success");

		if (validRows.length === 0) {
			setIsProcessing(false);
			return;
		}

		const totalToProcess = validRows.length;
		let processedSoFar = 0;
		const BATCH_SIZE = 10;

		for (let i = 0; i < totalToProcess; i += BATCH_SIZE) {
			const batch = validRows.slice(i, i + BATCH_SIZE);

			setRows(prev =>
				prev.map(r =>
					batch.some(b => b._rowIndex === r._rowIndex)
						? { ...r, _status: "processing" }
						: r
				)
			);

			const res = await fetch("/api/process-shipments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ shipments: batch }),
			});

			const data: {
				successes: (IntermodalFreightResponse & { rowIndex: number })[];
				failures: (ClimatiqApiError & { rowIndex: number })[];
			} = await res.json();

			setRows(prev => {
				const next = [...prev];

				data.successes.forEach(success => {
					const idx = next.findIndex(r => r._rowIndex === success.rowIndex);
					if (idx > -1) {
						next[idx] = { ...next[idx], _status: "success", _emissions: success.co2e };
					}
				});

				data.failures.forEach(failure => {
					const idx = next.findIndex(r => r._rowIndex === failure.rowIndex);
					if (idx > -1) {
						next[idx] = { ...next[idx], _status: "error", _error: failure.message };
					}
				});

				return next;
			});

			processedSoFar += BATCH_SIZE;
			setProcessingProgress(Math.floor((processedSoFar / totalToProcess) * 100));
		}

		setProcessingProgress(100);
		setIsProcessing(false);
	}, [rows, setRows]);

	return {
		isProcessing,
		processingProgress,
		processRows,
		setIsProcessing,
		setProcessingProgress
	};
}
