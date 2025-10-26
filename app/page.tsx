"use client";

import React, { useState } from "react";
import { REQUIRED_FIELDS } from "@/lib/constants";
import ValidationSummary from "@/components/ValidationSummary";
import { validateRow } from "@/lib/validation";
import { ColumnMapping, ParsedCsv, RawData, Shipment, ShipmentRow } from "@/types";
import DataOnboardingStep from "@/components/DataOnboardingStep";
import DataTable from "@/components/DataTable";
import { useShipmentStats } from "@/hooks/useShipmentStats";
import ProcessingSummary from "@/components/ProcessingSummary";
import { useProcessShipments } from "@/hooks/useProcessShipments";
import NavBar from "@/components/NavBar";
import { parseCSV } from "@/lib/csv";
import CsvUpload from "@/components/CsvUpload";

export default function Page() {
  const [rows, setRows] = useState<ShipmentRow[]>([]);
  const [parsedCsv, setParsedCsv] = useState<ParsedCsv | null>(null);
  const stats = useShipmentStats(rows);
  const {
    isProcessing,
    processingProgress,
    processRows,
    setIsProcessing,
    setProcessingProgress
  } = useProcessShipments(rows, setRows);
  const allValid = stats.errorCount === 0 && rows.length > 0;
  const showSummary = stats.processedCount > 0 || isProcessing;

  const remapColumns = (mapping: ColumnMapping, fullParsedData: RawData[]) => {
    const validated = fullParsedData.map((originalRow, index) => {
      const mappedRow: RawData = {};
      REQUIRED_FIELDS.forEach(field => {
        const uploadedHeader = mapping[field.key];
        mappedRow[field.key] = originalRow[uploadedHeader];
      });
      const row = validateRow(mappedRow as unknown as Shipment, index);
      row._originalData = originalRow;
      return row;
    });

    setIsProcessing(false);
    setProcessingProgress(0);
    setRows(validated);
    setParsedCsv(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    parseCSV(file, (fullParsedData, headers) => {
      setParsedCsv({ data: fullParsedData, headers, originalFile: file });
    });
  };

  const handleCancelOnboarding = () => {
    setParsedCsv(null);
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleUploadNewFile = () => {
    if (window.confirm("Upload a new file? All current data and results will be lost.")) {
      setRows([]);
      setProcessingProgress(0);
    }
  }

  if (parsedCsv) {
    return (
      <DataOnboardingStep
        uploadedHeaders={parsedCsv.headers}
        rawData={parsedCsv.data}
        onConfirm={(mapping) => remapColumns(mapping, parsedCsv.data)}
        onCancel={handleCancelOnboarding}
      />
    );
  }

  if (rows.length === 0) return <CsvUpload handleFileUpload={handleFileUpload} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar
        allValid={allValid}
        handleUploadNewFile={handleUploadNewFile}
        isProcessing={isProcessing}
        processRows={processRows}
        processingProgress={processingProgress}
        rows={rows}
        stats={stats}
      />
      <div className="max-w-7xl mx-auto pb-12">
        <ValidationSummary rows={rows} />
        {showSummary && <ProcessingSummary stats={stats} />}
        <DataTable
          rows={rows}
          setRows={setRows}
        />
      </div>
    </div>
  );
}
