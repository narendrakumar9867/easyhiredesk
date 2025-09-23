import React from "react";
import { FormField } from "../../types/form";

interface RenderFieldProps {
    field: FormField;
    formData: Record<string, any>;
    handleInputChange: (fieldLabel: string, value: any) => void;
}

const renderField:React.FC<RenderFieldProps> = ({field, formData, handleInputChange}) => {
    const commonProps = {
      required: field.required,
      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
      placeholder: field.placeholder,
      value: formData[field.label] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleInputChange(field.label, e.target.value)
    };

    switch (field.fieldType) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            {...commonProps}
            value={formData[field.label] || ''}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={(formData[field.label] || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = formData[field.label] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    handleInputChange(field.label, newValues);
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={field.label}
                  value={option}
                  checked={formData[field.label] === option}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <div>
            <input
              type="file"
              required={field.required}
              accept='.pdf,.doc,.docx'
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleInputChange(field.label, file);
              }}
            />
            {field.required && (
              <p className="text-sm text-gray-500 mt-1">
                Accepted formats: PDF, DOC, DOCX (Max: 10 MB)
              </p>
            )}
            {formData[field.label] && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {formData[field.label].name}
              </p>
            )}
          </div>
        );

      default:
        return (
          <input
            type={field.fieldType}
            {...commonProps}
          />
        );
    }
};

export default renderField;