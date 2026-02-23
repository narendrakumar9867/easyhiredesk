import React from 'react';

interface FieldOptionsManagerProps {
  fieldId: number;
  fieldType: string;
  options?: string[];
  onAddOption: (fieldId: number) => void;
  onUpdateOption: (fieldId: number, index: number, value: string) => void;
  onRemoveOption: (fieldId: number, index: number) => void;
}

const FieldOptionsManager: React.FC<FieldOptionsManagerProps> = ({
  fieldId,
  fieldType,
  options = [],
  onAddOption,
  onUpdateOption,
  onRemoveOption
}) => {
  if (!['select', 'radio', 'checkbox'].includes(fieldType)) {
    return null;
  }

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Options:</span>
        <button
          onClick={() => onAddOption(fieldId)}
          className="text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-600"
        >
          + Add Option
        </button>
      </div>
      {options.length > 0 ? (
        <div className="space-y-2">
          {options.map((option, optIdx) => (
            <div key={optIdx} className="flex items-center gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => onUpdateOption(fieldId, optIdx, e.target.value)}
                placeholder="Enter option value"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-800"
              />
              <button
                onClick={() => onRemoveOption(fieldId, optIdx)}
                className="text-red-600 hover:text-red-800 text-sm px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 italic">No options added yet</p>
      )}
    </div>
  );
};

export default FieldOptionsManager;