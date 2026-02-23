import React from 'react';
import { Mail } from 'lucide-react';

interface EmailTemplateEditorProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  previewName?: string;
  previewPosition?: string;
  type: 'selected' | 'rejected';
}

const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
  title,
  value,
  onChange,
  previewName = 'John Doe',
  previewPosition = 'Software Developer',
  type
}) => {
  const colorClasses = type === 'selected' 
    ? 'text-green-700 border-green-200 bg-green-50 text-green-700 text-green-800'
    : 'text-red-700 border-red-200 bg-red-50 text-red-700 text-red-800';

  return (
    <div className="bg-white p-6">
      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${type === 'selected' ? 'text-green-700' : 'text-red-700'}`}>
        <Mail size={20} />
        {title}
      </h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${type === 'selected' ? 'focus:ring-green-500' : 'focus:ring-red-500'} font-mono text-sm`}
        placeholder={`Write email template for ${type === 'selected' ? 'selected' : 'non-selected'} candidates...`}
      />
      <div className="mt-3 text-xs text-gray-500">
        Use [Candidate Name] and [Position] as placeholders
      </div>

      {/* Preview */}
      <div className={`mt-4 p-4 ${type === 'selected' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg`}>
        <h4 className={`font-medium ${type === 'selected' ? 'text-green-800' : 'text-red-800'} mb-2`}>Preview:</h4>
        <div className={`text-sm ${type === 'selected' ? 'text-green-700' : 'text-red-700'} whitespace-pre-line`}>
          {value
            .replace('[Candidate Name]', previewName)
            .replace(/\[Position\]/g, previewPosition)}
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;