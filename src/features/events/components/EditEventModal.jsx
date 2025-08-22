import React, { useState, useEffect } from 'react';
import eventApi from '../../../api/eventApi';
import { Universities } from "../../../constants/enums";
import {ChevronDown} from 'lucide-react';

const EditEventModal = ({ show, onClose, onEventUpdated, eventId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    university: '',
    maxParticipants: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show && eventId) {
      fetchEventData();
    }
  }, [show, eventId]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const response = await eventApi.getEventById(eventId);
      const event = response.data;
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().slice(0, 16),
        university: event.university,
        maxParticipants: event.maxParticipants
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching event data:', error);
      setError('Failed to load event data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await eventApi.updateEvent(eventId, formData);
      setSuccess(true);
      setTimeout(() => {
        onEventUpdated(response.data);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating event:', error);
      setError(error.response?.data?.message || 'Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div 
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 w-full max-w-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg 
                  className="w-6 h-6 text-purple-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Event
              </h2>
              <p className="text-gray-400 mt-1 text-sm">Update your event details</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 p-1.5 rounded-full transition-colors duration-200"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {loading && !success && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 relative">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-green-500/20 p-4 rounded-full mb-4">
                <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Event Updated!</h3>
              <p className="text-gray-400 mt-2">Your event has been successfully updated.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Event Title</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-600 transition-colors duration-200"
                      required
                      placeholder="Event name"
                    />
                    <svg 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                  <div className="relative">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-600 transition-colors duration-200"
                      required
                      placeholder="Describe your event"
                    />
                    <svg 
                      className="absolute left-3 top-4 w-5 h-5 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                </div>

                {/* <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">University</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-600 transition-colors duration-200"
                      required
                      placeholder="University name"
                    />
                    <svg 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                </div> */}
                <div className="space-y-2">
            <label className="block text-gray-400">University</label>
            <div className="relative">
              <select
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full appearance-none bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-lg px-4 py-2.5 pr-12 text-white cursor-pointer transition-all duration-300"
                required
              >
                <option value="" className="bg-gray-800 text-gray-400">Select a university</option>
                {Universities.map((uni) => (
                  <option key={uni} value={uni} className="bg-gray-800 text-white">{uni}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>  
          </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Date & Time</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-600 transition-colors duration-200"
                        required
                      />
                      <svg 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Max Participants</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        min="1"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-600 transition-colors duration-200"
                        required
                      />
                      <svg 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Event
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;