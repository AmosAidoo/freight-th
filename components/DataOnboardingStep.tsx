import { REQUIRED_FIELDS } from "@/lib/constants";
import type { ColumnMapping, RawData } from "@/types";
import { useMemo, useState } from "react";
import { AlertCircle, CornerUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface DataOnboardingStepProps {
	uploadedHeaders: string[];
	rawData: RawData[];
	onConfirm: (mapping: ColumnMapping) => void;
	onCancel: () => void;
}

const getInitialMapping = (headers: string[]): ColumnMapping => {
	const initialMapping: ColumnMapping = {};
	REQUIRED_FIELDS.forEach(field => {
		const uploadedHeader = headers.find(h => h == field.key);
		if (uploadedHeader) {
			initialMapping[field.key] = uploadedHeader;
		}
	});
	return initialMapping;
}

const DataOnboardingStep = ({ uploadedHeaders, rawData, onConfirm, onCancel }: DataOnboardingStepProps) => {
	const [mapping, setMapping] = useState<ColumnMapping>(getInitialMapping(uploadedHeaders));
	const previewData = useMemo(() => rawData.slice(0, 100), [rawData]);

	const handleChange = (internalKey: string, uploadedHeader: string) => {
		setMapping(prev => ({ ...prev, [internalKey]: uploadedHeader }));
	};

	const isMappingComplete = REQUIRED_FIELDS.every(field => mapping[field.key]);

	const getPreviewValue = (row: Record<string, unknown>, internalKey: string) => {
		const uploadedHeader = mapping[internalKey];
		if (uploadedHeader && row[uploadedHeader]) {
			return String(row[uploadedHeader]);
		}
		return <span className="text-gray-400 italic">Empty</span>;
	};

	return (
		<div className="min-h-screen bg-gray-100 p-4 sm:p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
					<CornerUpRight className="w-6 h-6 sm:w-7 sm:h-7" /> Data Onboarding
				</h1>
				<p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
					Map your CSV columns to the required fields below.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
					<div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit md:sticky md:top-8">
						<h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Column Mapping</h2>
						<div className="space-y-4">
							{REQUIRED_FIELDS.map(field => (
								<div key={field.key} className="flex flex-col">
									<label className="font-semibold text-sm text-gray-700 mb-1">
										{field.label}
									</label>
									<select
										value={mapping[field.key] || ""}
										onChange={(e) => handleChange(field.key, e.target.value)}
										className={`w-full p-2 border rounded-lg text-sm transition-colors ${!mapping[field.key] ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
									>
										<option value="" disabled>Select Column Header</option>
										{uploadedHeaders.map(header => (
											<option key={header} value={header}>{header}</option>
										))}
									</select>
									{!mapping[field.key] && (
										<p className="text-xs text-red-600 mt-1 flex items-center gap-1">
											<AlertCircle className="w-3 h-3" /> Required field
										</p>
									)}
								</div>
							))}
						</div>

						<div className="mt-8 pt-4 border-t flex flex-col gap-3">
							<Button
								onClick={() => onConfirm(mapping)}
								disabled={!isMappingComplete}
							>
								Proceed
							</Button>
							<Button
								variant="secondary"
								onClick={onCancel}
							>
								Upload New File
							</Button>
						</div>
					</div>

					<div className="md:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
						<div className="p-4 bg-gray-50 border-b">
							<h2 className="text-xl font-bold text-gray-800">Preview</h2>
							<p className="text-sm text-gray-500">Verify your column mapping by checking the displayed data below.</p>
						</div>
						<div className="overflow-x-auto max-h-[70vh]">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>#</TableHead>
										{REQUIRED_FIELDS.map(field => (
											<TableHead key={field.key}>
												{field.label}
											</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody className="divide-y divide-gray-100">
									{previewData.map((row, index) => (
										<TableRow key={index} className="hover:bg-gray-50">
											<TableCell className="px-4 py-2 text-gray-500">{index + 1}</TableCell>
											{REQUIRED_FIELDS.map(field => (
												<TableCell key={field.key}>
													{getPreviewValue(row, field.key)}
												</TableCell>
											))}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DataOnboardingStep