import React, { useState, useEffect } from 'react';
import eventApi from '../../../api/eventApi';

const DynamicFormSubmission = ({ eventId, formId, existingSubmission, onSubmissionComplete, onClose }) => {
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  useEffect(() => {
    loadForm();
    // if (existingSubmission) {
      loadExistingSubmission();
    // }
  }, [eventId, formId]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const response = await eventApi.getFormById(eventId, formId);
      setForm(response.data);
      const initialResponses = {};
      response.data.fields.forEach(field => {
        initialResponses[field.id] = '';
      });
      setResponses(initialResponses);
    } catch (error) {
      console.error('Error loading form:', error);
      setGeneralError('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const loadExistingSubmission = async () => {
    try {
      const response = await eventApi.getFormSubmission(eventId, formId);
      if (response.data && response.data.responses) {
        const submissionResponses = {};
        response.data.responses.forEach(resp => {
          submissionResponses[resp.fieldId] = resp.value;
        });
        setResponses(submissionResponses);
      }
    } catch (error) {
      console.error('Error loading existing submission:', error);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setResponses(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    form.fields.forEach(field => {
      const value = responses[field.id];
      
      // Check required fields
      if (field.required && (!value || value.toString().trim() === '')) {
        newErrors[field.id] = `${field.label} is required`;
        return;
      }
      
      // Skip validation if field is empty and not required
      if (!value || value.toString().trim() === '') {
        return;
      }
      
      // Email validation
      if (field.type === 'EMAIL') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.id] = 'Please enter a valid email address';
        }
      }
      
      // Number validation
      if (field.type === 'NUMBER') {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          newErrors[field.id] = 'Please enter a valid number';
        } else {
          if (field.minValue !== undefined && numValue < field.minValue) {
            newErrors[field.id] = `Value must be at least ${field.minValue}`;
          }
          if (field.maxValue !== undefined && numValue > field.maxValue) {
            newErrors[field.id] = `Value must be at most ${field.maxValue}`;
          }
        }
      }
      
      // Text length validation
      if (field.type === 'TEXT') {
        if (field.minLength && value.length < field.minLength) {
          newErrors[field.id] = `Must be at least ${field.minLength} characters`;
        }
        if (field.maxLength && value.length > field.maxLength) {
          newErrors[field.id] = `Must be at most ${field.maxLength} characters`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setGeneralError(null);
    
    try {
      // Prepare responses for API
      const apiResponses = Object.entries(responses)
        .filter(([fieldId, value]) => value !== '' && value !== null && value !== undefined)
        .map(([fieldId, value]) => ({
          fieldId: parseInt(fieldId),
          value: value.toString()
        }));
      
      let response;
      if (existingSubmission) {
        // Update existing submission
        response = await eventApi.updateFormSubmission(eventId, formId, apiResponses);
      } else {
        // Register for event with form submission
        response = await eventApi.registerForEventWithForm(eventId, formId, apiResponses);
        
        // Try to download ticket for new registrations
        try {
          const pdfResponse = await eventApi.downloadPdf(response.data.id);
          
          // Handle direct PDF response from backend
          let blob;
          if (pdfResponse.data instanceof Blob) {
            blob = pdfResponse.data;
          } else {
            // If response.data is not already a blob, create one
            blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
          }
          
          const url = window.URL.createObjectURL(blob);
          
          // Create a temporary download link
          const link = document.createElement('a');
          link.href = url;
          link.download = `ticket-${response.data.id}.pdf`;
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
        } catch (pdfError) {
          console.error('Error downloading ticket:', pdfError);
        }
      }
      
      onSubmissionComplete(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
      setGeneralError(error.response?.data?.message || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field) => {
    const fieldValue = responses[field.id] || '';
    const hasError = errors[field.id];
    const baseInputClasses = `w-full px-3 py-2 bg-gray-700 text-white rounded-lg border ${
      hasError ? 'border-red-500' : 'border-gray-600'
    } focus:outline-none focus:ring-2 ${
      hasError ? 'focus:ring-red-500' : 'focus:ring-purple-600'
    }`;
    
    switch (field.type) {
      case 'TEXT':
        return (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
            minLength={field.minLength}
            maxLength={field.maxLength}
          />
        );
      
      case 'EMAIL':
        return (
          <input
            type="email"
            value={fieldValue}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder || 'Enter your email'}
            className={baseInputClasses}
          />
        );
      
      case 'NUMBER':
        return (
          <input
            type="number"
            value={fieldValue}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
            min={field.minValue}
            max={field.maxValue}
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
          <select
            value={fieldValue}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={baseInputClasses}
          >
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
            value={fieldValue}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-white">Loading form...</div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-red-400">Failed to load form</div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">{form.title}</h2>
              {form.deadline && (
                <div className="text-sm text-gray-400 mt-1">
                  Deadline: {new Date(form.deadline).toLocaleString()}
                </div>
              )}
              
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {generalError && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {form.fields
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block text-gray-300">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                
                {renderField(field)}
                
                {errors[field.id] && (
                  <div className="text-red-400 text-sm">
                    {errors[field.id]}
                  </div>
                )}
                
                {field.helpText && (
                  <div className="text-gray-400 text-sm">
                    {field.helpText}
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-600">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-400 hover:text-white bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : existingSubmission ? 'Update Registration' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DynamicFormSubmission;