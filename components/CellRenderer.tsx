import type { Shipment, ShipmentRow } from "@/types";

interface CellRendererProps {
  row: ShipmentRow;
  field: keyof Shipment;
  editingCell: { rowIndex: number; field: string } | null;
  editValue: string;
  handleOpenEdit: (rowIndex: number, field: keyof Shipment, currentValue: string | number | undefined) => void;
  handleCellEdit: (rowIndex: number, field: keyof Shipment, value: string) => void;
  type: "text" | "number" | "select";
  options?: string[];
}

const CellRenderer = ({
  row,
  field,
  editingCell,
  editValue,
  handleOpenEdit,
  handleCellEdit,
  type,
  options
}: CellRendererProps) => {
  const isEditing = editingCell?.rowIndex === row._rowIndex && editingCell.field === field;
  const value = row[field];
  const displayValue = field === "weight_kg" && typeof value === "number" && !isNaN(value) ? value.toFixed(2) : value || "—";
  const error = row._validationErrors?.[field];

  const handleSave = () => handleCellEdit(row._rowIndex, field, editValue);
  const setEditValue = (v: string) => handleCellEdit(row._rowIndex, field, v);

  const commonProps = {
	autoFocus: true,
	value: editValue,
	onChange: (e: React.ChangeEvent<{ value: string }>) => setEditValue(e.target.value),
	onBlur: handleSave,
	onKeyDown: (e: React.KeyboardEvent) => e.key === "Enter" && handleSave(),
	className: "w-full py-1 border border-blue-500 rounded focus:ring-1 focus:ring-blue-500 outline-none",
  };

  return (
	<td className="py-3 max-w-xs truncate">
	  {isEditing ? (
		type === "select" ? (
		  <select {...commonProps} onChange={(e) => setEditValue(e.target.value)} onBlur={handleSave}>
			<option value="" disabled>Select...</option>
			{options?.map(m => <option key={m} value={m}>{m}</option>)}
		  </select>
		) : (
		  <input
			{...commonProps}
			type={type}
			onChange={(e) => setEditValue(e.target.value)}
		  />
		)
	  ) : (
		<div
		  onClick={() => handleOpenEdit(row._rowIndex, field, value)}
		  className={`py-1 rounded transition-colors cursor-pointer text-ellipsis overflow-hidden ${error ? "border-2 border-red-500 bg-red-100" : "hover:bg-gray-100"}`}
		>
		  {displayValue}
		</div>
	  )}
	</td>
  );
};

export default CellRenderer;