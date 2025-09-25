import React, { useState, useEffect } from 'react';

const FormFieldEditor = ({ field, onSave, onClose }) => {
  const [fieldData, setFieldData] = useState({
    label: '',
    type: 'TEXT',
    required: false,
    placeholder: '',
    helpText: '',
    options: '[]'
  });

  const [optionsText, setOptionsText] = useState('');

  useEffect(() => {
    if (field) {
      setFieldData({
        ...field,
        options: field.options || '[]'
      });
      
      // Parse options for dropdown display
      if (field.type === 'DROPDOWN' && field.options) {
        try {
          const optionsArray = JSON.parse(field.options);
          setOptionsText(optionsArray.join('\n'));
        } catch (e) {
          setOptionsText('');
        }
      }
    }
  }, [field]);

  const handleSave = () => {
    let finalOptions = fieldData.options;
    
    // Handle dropdown options
    if (fieldData.type === 'DROPDOWN') {
      const optionsArray = optionsText
        .split('\n')
        .map(option => option.trim())
        .filter(option => option.length > 0);
      finalOptions = JSON.stringify(optionsArray);
    }

    onSave({
      ...fieldData,
      options: finalOptions
    });
  };

  const handleChange = (field, value) => {
    setFieldData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Edit Field</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Field Label */}
          <div>
            <label className="block text-gray-400 mb-2">Field Label *</label>
            <input
              type="text"
              value={fieldData.label}
              onChange={(e) => handleChange('label', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder={`Enter label (e.g., ${fieldData.type === 'EMAIL' ? 'Email' : fieldData.type === 'NUMBER' ? 'Age' : 'Full Name'})`}
              required
            />
          </div>

          {/* Field Type */}
          <div>
            <label className="block text-gray-400 mb-2">Field Type</label>
            <select
              value={fieldData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="TEXT">Text Input</option>
              <option value="EMAIL">Email</option>
              <option value="NUMBER">Number</option>
              <option value="DROPDOWN">Dropdown</option>
            </select>
          </div>

          {/* Required Field */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={fieldData.required}
              onChange={(e) => handleChange('required', e.target.checked)}
              className="text-purple-600"
            />
            <label htmlFor="required" className="text-gray-400">Required field</label>
          </div>

          {/* Placeholder */}
          <div>
            <label className="block text-gray-400 mb-2">Placeholder Text</label>
            <input
              type="text"
              value={fieldData.placeholder}
              onChange={(e) => handleChange('placeholder', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder={`e.g., Enter your ${fieldData.type === 'EMAIL' ? 'email address' : fieldData.type === 'NUMBER' ? 'age or number' : 'full name'}`}
            />
          </div>

          {/* Help Text */}
          <div>
            <label className="block text-gray-400 mb-2">Help Text</label>
            <input
              type="text"
              value={fieldData.helpText}
              onChange={(e) => handleChange('helpText', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Additional guidance for users"
            />
          </div>

          {/* Dropdown Options */}
          {fieldData.type === 'DROPDOWN' && (
            <div>
              <label className="block text-gray-400 mb-2">Dropdown Options</label>
              <textarea
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                rows="4"
                placeholder="Enter each option on a new line"
              />
              <div className="text-gray-500 text-sm mt-1">
                Enter each option on a new line
              </div>
            </div>
          )}

          {/* Validation Rules for Number */}
          {fieldData.type === 'NUMBER' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 mb-2">Min Value</label>
                <input
                  type="number"
                  value={fieldData.minValue || ''}
                  onChange={(e) => handleChange('minValue', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Minimum"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Max Value</label>
                <input
                  type="number"
                  value={fieldData.maxValue || ''}
                  onChange={(e) => handleChange('maxValue', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Maximum"
                />
              </div>
            </div>
          )}

          {/* Text Field Settings */}
          {fieldData.type === 'TEXT' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 mb-2">Min Length</label>
                <input
                  type="number"
                  value={fieldData.minLength || ''}
                  onChange={(e) => handleChange('minLength', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Min chars"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Max Length</label>
                <input
                  type="number"
                  value={fieldData.maxLength || ''}
                  onChange={(e) => handleChange('maxLength', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Max chars"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!fieldData.label.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Field
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormFieldEditor;