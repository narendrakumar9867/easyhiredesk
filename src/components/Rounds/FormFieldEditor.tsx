import React from 'react';
import { Trash2 } from 'lucide-react';
import { FormField } from '@/src/types/rounds';
import { fieldTypes } from '@/src/utils/fieldTypes';
import FieldOptionsManager from './FieldOptionsManager';

interface FormFieldEditorProps {
  field: FormField;
  index: number;
  canDelete: boolean;
  onUpdate: (id: number, updates: Partial<FormField>) => void;
  onRemove: (id: number) => void;
  onAddOption: (fieldId: number) => void;
  onUpdateOption: (fieldId: number, index: number, value: string) => void;
  onRemoveOption: (fieldId: number, index: number) => void;
}

const FormFieldEditor: React.FC<FormFieldEditorProps> = ({
  field,
  index,
  canDelete,
  onUpdate,
  onRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate(field.id, { label: e.target.value })}
            className="font-medium text-gray-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 w-full"
          />
        </div>
        {canDelete && (
          <button
            onClick={() => onRemove(field.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <select
          value={field.type}
          onChange={(e) => onUpdate(field.id, { type: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {fieldTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        
        <input
          type="text"
          value={field.placeholder}
          onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
          placeholder="Placeholder text"
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>
      
      <label className="flex items-center mt-3">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
          className="mr-2"
        />
        <span className="text-sm text-gray-600">Required field</span>
      </label>

      <FieldOptionsManager
        fieldId={field.id}
        fieldType={field.type}
        options={field.options}
        onAddOption={onAddOption}
        onUpdateOption={onUpdateOption}
        onRemoveOption={onRemoveOption}
      />
    </div>
  );
};

export default FormFieldEditor;