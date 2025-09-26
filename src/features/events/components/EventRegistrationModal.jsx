import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  FileText,
  AlertCircle,
  Download,
  Trash2,
} from 'lucide-react';
import eventApi from '../../../api/eventApi';
import DynamicFormSubmission from './DynamicFormSubmission';

const EventRegistrationModal = ({
  eventId,
  show,
  onClose,
  onRegistrationComplete,
}) => {
  const [event, setEvent] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [showFormSubmission, setShowFormSubmission] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [availableSpots, setAvailableSpots] = useState(null);
  const [showUnregisterModal, setShowUnregisterModal] = useState(false);
  const [unregistering, setUnregistering] = useState(false);

  useEffect(() => {
    if (show && eventId) {
      loadEventData();
    }
  }, [show, eventId]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load event details
      const eventResponse = await eventApi.getEventById(eventId);
      setEvent(eventResponse.data);

        try {
          const spotsResponse = await eventApi.getAvailableSpots(eventId);
          // console.log(spotsResponse.data);

          setAvailableSpots(spotsResponse.data);
        } catch (spotsError) {
          setAvailableSpots(null);
        }

      try {
        const statusResponse = await eventApi.getRegistrationStatus(eventId);
        setRegistrationStatus(statusResponse.data);
      } catch (e) {
        setRegistrationStatus(null);
      }

      // Check for active form
      try {
        const formResponse = await eventApi.getActiveForm(eventId);
        console.log(formResponse);

        setActiveForm(formResponse);
      } catch (formError) {
        // No active form found, that's okay
        setActiveForm(null);
      }
    } catch (error) {
      console.error('Error loading event data:', error);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleSimpleRegistration = async () => {
    try {
      setRegistering(true);
      setError(null);


      const response = await eventApi.registerForEvent(eventId);

      // Try to download ticket
      try {
        const pdfResponse = await eventApi.downloadPdf(response.data.id);
        
        // Since backend returns byte[] and API uses responseType: 'blob', 
        // response.data will be a Blob object
        const blob = pdfResponse.data;
        
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

      onRegistrationComplete(response.data);
      onClose();
    } catch (error) {
      console.error('Error registering for event:', error);
      setError(error.response?.data?.message || 'Failed to register for event');
    } finally {
      setRegistering(false);
    }
  };

  const handleFormRegistration = (formId) => {
    setSelectedFormId(formId);
    setShowFormSubmission(true);
  };

  const handleFormSubmissionComplete = submissionData => {
    setShowFormSubmission(false);
    onRegistrationComplete(submissionData);
    onClose();
  };

  const handleDownloadTicket = async () => {
    try {
      const registrationId = await eventApi.getRegistrationId(eventId);
      
      if (registrationId) {
        const pdfResponse = await eventApi.downloadPdf(registrationId.data);
        
        // Since backend returns byte[] and API uses responseType: 'blob', 
        // response.data will be a Blob object
        const blob = pdfResponse.data;
        
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket-${registrationId.data}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading ticket:', error);
      setError('Failed to download ticket');
    }
  };

  const handleUnregister = async (formId) => {
    try {
      setUnregistering(true);
      setError(null);

      await eventApi.deleteForm(eventId, formId);
      
      setShowUnregisterModal(null);
      onRegistrationComplete(null); // Notify parent that registration was removed
      onClose();
    } catch (error) {
      console.error('Error unregistering from event:', error);
      setError(error.response?.data?.message || 'Failed to unregister from event');
      setShowUnregisterModal(null);
    } finally {
      setUnregistering(false);
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hasCapacityLimit = () => {
    return (
      event &&
      typeof event.maxParticipants === 'number' &&
      event.maxParticipants > 0
    );
  };

  if (!show) return null;
  
  if (showFormSubmission && selectedFormId) {
    
    return (
      <DynamicFormSubmission
        eventId={eventId}
        formId={selectedFormId}
        existingSubmission={registrationStatus}
        onSubmissionComplete={handleFormSubmissionComplete}
        onClose={() => {
          setShowFormSubmission(false);
          setSelectedFormId(null);
        }}
      />
    );
  }  

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-white">Loading event details...</div>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md">
          <div className="text-red-400 mb-4">{error}</div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const isEventFull = hasCapacityLimit() ? availableSpots <= 0 : false;
  const isEventPast = new Date(event?.endDate) < new Date();
  const isAlreadyRegistered = registrationStatus;
  const canRegister = !isEventFull && !isEventPast && !isAlreadyRegistered;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {event?.title}
              </h2>
              <div className="text-gray-400">Event Registration</div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Event Details */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Event Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-sm text-gray-400">Start Date</div>
                  <div>{formatDate(event?.startDate)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-sm text-gray-400">End Date</div>
                  <div>{formatDate(event?.endDate)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-sm text-gray-400">Location</div>
                  <div>{event?.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-sm text-gray-400">Available Spots</div>
                  {hasCapacityLimit() ? (
                    <div
                      className={
                        availableSpots <= 5 && availableSpots > 0
                          ? 'text-yellow-400'
                          : isEventFull
                            ? 'text-red-400'
                            : 'text-green-400'
                      }
                    >
                      {Math.max(0, availableSpots)} / {event?.maxParticipants}
                    </div>
                  ) : (
                    <div className="text-green-400">Unlimited spots</div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-gray-300">
              <div className="text-sm text-gray-400 mb-2">Description</div>
              <p>{event?.description}</p>
            </div>
          </div>

          {/* Registration Status */}
          {isAlreadyRegistered && (
            <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-green-300 mb-3">
                <FileText className="w-5 h-5" />
                <span>You are already registered for this event</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadTicket()}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Ticket
                </button>
                {/* {activeForm && (
                  <button
                    onClick={() => handleFormRegistration(isAlreadyRegistered)}
                    className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    View/Edit Registration Form
                  </button>
                )} */}
              </div>
            </div>
          )}

          {isEventFull && !isAlreadyRegistered && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-300">
                <AlertCircle className="w-5 h-5" />
                <span>This event is full</span>
              </div>
            </div>
          )}

          {isEventPast && (
            <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-300">
                <Clock className="w-5 h-5" />
                <span>This event has already ended</span>
              </div>
            </div>
          )}

          {/* Form Information */}
          {activeForm && activeForm.data && canRegister && (
            <div>
              {activeForm.data.map((form, index) => (
                <div key={index}>
                  <div className="bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-blue-300 mb-2">
                      <FileText className="w-5 h-5" />
                      <span>Registration Form Required</span>
                    </div>
                    <div className="text-gray-300 text-sm">
                      This event requires you to fill out a registration form: "
                      {form.title}"
                      {form.deadline && (
                        <div className="mt-1 text-gray-400">
                          Form deadline:{' '}
                          {new Date(form.deadline).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => handleFormRegistration(form.id)}
                        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Fill Registration Form
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6">
              <div className="text-red-300">{error}</div>
            </div>
          )}

          {/* Registration Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
            {isAlreadyRegistered ? (
              // Already registered - show Update, Unregister, Cancel buttons
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-400 hover:text-white bg-gray-700 rounded-lg"
                >
                  Cancel / Back
                </button>
                <button
                  onClick={() => setShowUnregisterModal(isAlreadyRegistered)}
                  disabled={unregistering}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {unregistering ? 'Unregistering...' : 'Unregister'}
                </button>
                {activeForm && (
                  <button
                    onClick={() => handleFormRegistration(isAlreadyRegistered)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Update Registration
                  </button>
                )}
              </>
            ) : (
              // Not registered - show original buttons
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-400 hover:text-white bg-gray-700 rounded-lg"
                >
                  Close
                </button>
                {canRegister && !activeForm && (
                  <button
                    onClick={handleSimpleRegistration}
                    disabled={registering}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registering ? 'Registering...' : 'Register Now'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Unregister Confirmation Modal */}
      {showUnregisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-60 flex justify-center items-center">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 border border-gray-600">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Confirm Unregistration</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Are you sure you want to unregister from this event? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUnregisterModal(null)}
                className="px-4 py-2 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnregister(showUnregisterModal)}
                disabled={unregistering}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {unregistering ? 'Unregistering...' : 'Confirm Unregister'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegistrationModal;
