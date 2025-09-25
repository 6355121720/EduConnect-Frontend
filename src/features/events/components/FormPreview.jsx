import React from 'react';

const FormPreview = ({ formData }) => {
  const renderField = (field) => {
    const baseInputClasses = "w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600";
    
    switch (field.type) {
      case 'TEXT':
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            className={baseInputClasses}
            disabled
          />
        );
      
      case 'EMAIL':
        return (
          <input
            type="email"
            placeholder={field.placeholder || 'Enter your email'}
            className={baseInputClasses}
            disabled
          />
        );
      
      case 'NUMBER':
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            min={field.minValue}
            max={field.maxValue}
            className={baseInputClasses}
            disabled
          />
        );
      
      case 'DROPDOWN':
        let options = [];
        try {
          options = JSON.parse(field.options || '[]');
        } catch (e) {
          options = [];
        }
        
        return (
          <select className={baseInputClasses} disabled>
            <option value="">{field.placeholder || 'Select an option'}</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            className={baseInputClasses}
            disabled
          />
        );
    }
  };

  if (!formData || !formData.fields) {
    return (
      <div className="text-gray-400 text-center py-8">
        No form data to preview
      </div>
    );
  }

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      {/* Form Header */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-white mb-2">
          {formData.title || 'Registration Form'}
        </h4>
        {formData.deadline && (
          <div className="text-sm text-gray-400">
            Deadline: {new Date(formData.deadline).toLocaleString()}
          </div>
        )}
        {!formData.isActive && (
          <div className="text-sm text-yellow-400">
            ⚠️ Form is currently inactive
          </div>
        )}
      </div>

      {/* Form Fields */}
      {formData.fields.length === 0 ? (
        <div className="text-gray-400 text-center py-4">
          No fields added yet
        </div>
      ) : (
        <div className="space-y-4">
          {formData.fields
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-gray-300 text-sm">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              
              {renderField(field)}
              
              {field.helpText && (
                <div className="text-xs text-gray-400">
                  {field.helpText}
                </div>
              )}
            </div>
          ))}
          
          {/* Submit Button Preview */}
          <div className="pt-4 border-t border-gray-600">
            <button
              type="button"
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg opacity-50 cursor-not-allowed"
              disabled
            >
              Submit Registration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPreview;