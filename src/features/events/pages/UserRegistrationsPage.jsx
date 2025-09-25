import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Download, Edit, Trash2, FileText, Clock } from 'lucide-react';
import eventApi from '../../../api/eventApi';
import DynamicFormSubmission from '../components/DynamicFormSubmission';

const UserRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [showFormEdit, setShowFormEdit] = useState(false);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventApi.getMyRegistrations();
      setRegistrations(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error('Error loading registrations:', error);
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to unregister from "${eventTitle}"?`)) {
      return;
    }

    try {
      await eventApi.unregisterFromEvent(eventId);
      loadRegistrations(); // Reload the list
    } catch (error) {
      console.error('Error unregistering:', error);
      alert('Failed to unregister from event');
    }
  };

  const handleDownloadTicket = async (registrationId) => {
    try {
      const response = await eventApi.downloadPdf(registrationId);
      
      // Handle direct PDF response from backend
      let blob;
      if (response.data instanceof Blob) {
        blob = response.data;
      } else {
        // If response.data is not already a blob, create one
        blob = new Blob([response.data], { type: 'application/pdf' });
      }
      
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${registrationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading ticket:', error);
      alert('Failed to download ticket');
    }
  };

  const handleEditRegistration = async (registration) => {
    try {
      // Check if the event has an active form
      const formResponse = await eventApi.getActiveForm(registration.event.id);
      if (formResponse.data) {
        setEditingRegistration(registration);
        setShowFormEdit(true);
      } else {
        alert('This event does not have an editable registration form');
      }
    } catch (error) {
      console.error('Error checking form:', error);
      alert('Cannot edit registration - no form available');
    }
  };

  const handleFormUpdateComplete = () => {
    setShowFormEdit(false);
    setEditingRegistration(null);
    loadRegistrations();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = (event) => {
    const now = new Date();
    {console.log(event);
    }
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (endDate < now) {
      return { status: 'completed', color: 'text-gray-400', label: 'Completed' };
    } else if (startDate <= now && endDate >= now) {
      return { status: 'ongoing', color: 'text-green-400', label: 'Ongoing' };
    } else {
      return { status: 'upcoming', color: 'text-blue-400', label: 'Upcoming' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading your registrations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={loadRegistrations}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Registrations</h1>
          <p className="text-gray-400">Manage your event registrations and download tickets</p>
        </div>

        {registrations.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              You haven't registered for any events yet
            </div>
            <button
              onClick={() => window.location.href = '/events'}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((registration) => {
              console.log(registration);
              
              const eventStatus = getEventStatus(registration);
              
              return (
                <div key={registration.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  {/* Event Banner */}
                  {registration.bannerUrl && (
                    <img
                      src={registration.bannerUrl}
                      alt={registration.title}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  
                  <div className="p-6">
                    {/* Event Title and Status */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {registration.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded ${eventStatus.color} bg-opacity-20`}>
                        {eventStatus.label}
                      </span>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span>{formatDate(registration.startDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span className="truncate">{registration.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>Registered: {formatDate(registration.registrationDate)}</span>
                      </div>
                    </div>

                    {/* Registration Type */}
                    {registration.hasFormSubmission && (
                      <div className="flex items-center gap-2 text-blue-300 text-sm mb-4">
                        <FileText className="w-4 h-4" />
                        <span>Form-based registration</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleDownloadTicket(registration.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Download className="w-4 h-4" />
                        Download Ticket
                      </button>
                      
                      <div className="flex gap-2">
                        {registration.hasFormSubmission && (
                          <button
                            onClick={() => handleEditRegistration(registration)}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                        )}
                        
                        {eventStatus.status === 'upcoming' && (
                          <button
                            onClick={() => handleUnregister(registration.event.id, registration.event.title)}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Unregister
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Edit Modal */}
      {showFormEdit && editingRegistration && (
        <DynamicFormSubmission
          eventId={editingRegistration.event.id}
          formId={editingRegistration.formId}
          existingSubmission={true}
          onSubmissionComplete={handleFormUpdateComplete}
          onClose={() => {
            setShowFormEdit(false);
            setEditingRegistration(null);
          }}
        />
      )}
    </div>
  );
};

export default UserRegistrationsPage;