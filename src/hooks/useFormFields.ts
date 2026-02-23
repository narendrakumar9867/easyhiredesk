import { useState } from 'react';
import { FormField } from '@/src/types/rounds';

export const useFormFields = (initialFields: FormField[]) => {
  const [formFields, setFormFields] = useState<FormField[]>(initialFields);

  const addField = (field: Omit<FormField, 'id'>) => {
    const newField: FormField = {
      id: Date.now(),
      ...field
    };
    setFormFields([...formFields, newField]);
  };

  const removeField = (id: number) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const updateField = (id: number, updates: Partial<FormField>) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const addOption = (fieldId: number) => {
    setFormFields(formFields.map(field => 
      field.id === fieldId 
        ? { ...field, options: [...(field.options || []), ''], isAddingOption: true }
        : field
    ));
  };

  const updateOption = (fieldId: number, optionIndex: number, value: string) => {
    setFormFields(formFields.map(field => 
      field.id === fieldId 
        ? { 
            ...field, 
            options: field.options?.map((opt, idx) => idx === optionIndex ? value : opt)
          }
        : field
    ));
  };

  const removeOption = (fieldId: number, optionIndex: number) => {
    setFormFields(formFields.map(field => 
      field.id === fieldId 
        ? { ...field, options: field.options?.filter((_, i) => i !== optionIndex) }
        : field
    ));
  };

  return {
    formFields,
    setFormFields,
    addField,
    removeField,
    updateField,
    addOption,
    updateOption,
    removeOption
  };
};