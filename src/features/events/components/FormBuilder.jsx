import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Eye, Settings, GripVertical } from 'lucide-react';
import FormFieldEditor from './FormFieldEditor';
import FormPreview from './FormPreview';
import eventApi from '../../../api/eventApi';

const FIELD_TYPES = [
  { id: 'TEXT', label: 'Text Input', icon: '📝' },
  { id: 'EMAIL', label: 'Email', icon: '📧' },
  { id: 'NUMBER', label: 'Number', icon: '🔢' },
  { id: 'DROPDOWN', label: 'Dropdown', icon: '📋' }
];

const FormBuilder = ({ eventId, form, onFormSaved, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    deadline: '',
    isActive: true,
    fields: []
  });
  const [editingField, setEditingField] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draggedField, setDraggedField] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    if (form) {
      setFormData({
        title: form.title || '',
        deadline: form.deadline ? form.deadline.slice(0, 16) : '',
        isActive: form.isActive !== undefined ? form.isActive : true,
        fields: form.fields || []
      });
    }
  }, [form]);

  const addField = (fieldType) => {
    const newField = {
      id: Date.now(),
      label: '',
      type: fieldType.id,
      required: false,
      orderIndex: formData.fields.length + 1,
      placeholder: '',
      helpText: '',
      options: fieldType.id === 'DROPDOWN' ? '[]' : undefined
    };
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    
    setEditingField(newField);
    setShowFieldEditor(true);
  };

  const editField = (field) => {
    setEditingField(field);
    setShowFieldEditor(true);
  };

  const saveField = (updatedField) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === updatedField.id ? updatedField : field
      )
    }));
    setShowFieldEditor(false);
    setEditingField(null);
  };

  const deleteField = (fieldId) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
        .map((field, index) => ({ ...field, orderIndex: index + 1 }))
    }));
  };

  const handleDragStart = (e, field) => {
    setDraggedField(field);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (!draggedField) return;
    
    const draggedIndex = formData.fields.findIndex(field => field.id === draggedField.id);
    if (draggedIndex === dropIndex) return;
    
    const newFields = [...formData.fields];
    const [removed] = newFields.splice(draggedIndex, 1);
    newFields.splice(dropIndex, 0, removed);
    
    // Update order indices
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      orderIndex: index + 1
    }));
    
    setFormData(prev => ({
      ...prev,
      fields: updatedFields
    }));
    
    setDraggedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare form data for API
      const apiFormData = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        fields: formData.fields.map(field => ({
          ...field,
          id: field.id > 1000000000000 ? undefined : field.id, // Remove temp IDs
          options: field.type === 'DROPDOWN' && field.options ? field.options : undefined
        }))
      };

      let response;
      if (form?.id) {
        // Update existing form
        response = await eventApi.updateForm(eventId, form.id, apiFormData);
      } else {
        // Create new form
        response = await eventApi.createForm(eventId, apiFormData);
      }

      onFormSaved(response.data);
      onClose();
    } catch (err) {
      console.error('Error saving form:', err);
      setError(err.response?.data?.message || 'Failed to save form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg w-full max-w-6xl h-[90vh] flex">
        {/* Main Form Builder */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {form?.id ? 'Edit Form' : 'Create Registration Form'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Settings */}
            <div className="bg-gray-700 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-medium text-white">Form Settings</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Form Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Registration Form"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2">Deadline</label>
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="text-purple-600"
                />
                <label htmlFor="isActive" className="text-gray-400">Form is active</label>
              </div>
            </div>

            {/* Field Types Palette */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-4">Add Fields</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {FIELD_TYPES.map(fieldType => (
                  <button
                    key={fieldType.id}
                    type="button"
                    onClick={() => addField(fieldType)}
                    className="flex items-center gap-2 p-3 bg-gray-600 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <span>{fieldType.icon}</span>
                    <span className="text-sm text-white">{fieldType.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-4">Form Fields</h3>
              
              {formData.fields.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No fields added yet. Click on a field type above to get started.
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.fields.map((field, index) => (
                    <div
                      key={field.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, field)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`bg-gray-600 rounded-lg p-3 flex items-center justify-between cursor-move transition-all ${
                        dragOverIndex === index ? 'border-2 border-purple-500' : ''
                      } ${draggedField?.id === field.id ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-white font-medium">{field.label}</div>
                          <div className="text-gray-400 text-sm">
                            {field.type} {field.required && '• Required'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => editField(field)}
                          className="p-1 text-gray-400 hover:text-blue-400"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteField(field.id)}
                          className="p-1 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-400 hover:text-white bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || formData.fields.length === 0}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : form?.id ? 'Update Form' : 'Create Form'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Sidebar */}
        {showPreview && (
          <div className="w-96 bg-gray-750 border-l border-gray-600 p-4 overflow-y-auto">
            <h3 className="text-lg font-medium text-white mb-4">Form Preview</h3>
            <FormPreview formData={formData} />
          </div>
        )}
      </div>

      {/* Field Editor Modal */}
      {showFieldEditor && (
        <FormFieldEditor
          field={editingField}
          onSave={saveField}
          onClose={() => {
            setShowFieldEditor(false);
            setEditingField(null);
          }}
        />
      )}
    </div>
  );
};

export default FormBuilder;