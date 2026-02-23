import React from 'react';
import { FormField } from '@/src/types/rounds';

interface FormFieldPreviewProps {
  field: FormField;
}

const FormFieldPreview: React.FC<FormFieldPreviewProps> = ({ field }) => {
  const commonProps = {
    className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800",
    placeholder: field.placeholder,
    required: field.required
  };

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} rows={3} />;
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center">
                <input 
                  type="radio" 
                  name={`radio-${field.id}`}
                  value={option}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center">
                <input 
                  type="checkbox" 
                  value={option}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'file':
        return <input type="file" {...commonProps} className="w-full px-3 py-2 border border-gray-300 rounded-md" />;
      
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
    </div>
  );
};

export default FormFieldPreview;