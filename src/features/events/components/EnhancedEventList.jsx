import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import eventApi from '../../../api/eventApi';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Edit, 
  Trash2, 
  Eye,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  fetchEvents,
  registerForEvent,
  unregisterFromEvent,
  deleteEvent,
  setSearchQuery,
  setFilterType,
  clearError,
  clearSuccessMessage,
  fetchAvailableSpots,
  setAvailableSpots
} from '../../../store/slices/eventsSlice';
import EventRegistrationModal from './EventRegistrationModal';
import DynamicFormSubmission from './DynamicFormSubmission';
import EditEventModal from './EditEventModal';

const EnhancedEventList = ({ 
  searchQuery = '', 
  filterType = 'all', 
  showPagination = true,
  limit = 9
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const {
    events,
    totalPages,
    currentPage,
    eventsLoading,
    error,
    successMessage,
    availableSpots
  } = useSelector(state => state.events);
  
  const { user } = useSelector(state => state.auth);
  
  const [registrationModal, setRegistrationModal] = useState({ show: false, eventId: null });
  const [editModal, setEditModal] = useState({ show: false, eventId: null });
  const [registering, setRegistering] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [submissionModal, setSubmissionModal] = useState({ show: false, eventId: null, formId: null });
  const [registrationStatuses, setRegistrationStatuses] = useState({});
  useEffect(() => {
    loadEvents();
  }, [currentPage, searchQuery, filterType]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => dispatch(clearSuccessMessage()), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (events && events.length > 0) {
      const eventIds = events.filter(event => event && event.id).map(event => event.id);
      dispatch(fetchAvailableSpots(eventIds));
      
      if (user) {
        loadRegistrationStatuses();
      }
    }
  }, [events, user, dispatch]);

  const loadEvents = () => {
    dispatch(fetchEvents({
      page: currentPage,
      size: limit,
      searchQuery,
      filterType
    }));
  };

  const loadRegistrationStatuses = async () => {
    if (!user) return;
    
    const statuses = {};
    const validEvents = events.filter(event => event && event.id);
    
    try {
      await Promise.all(
        validEvents.map(async (event) => {
          try {
            const response = await eventApi.getRegistrationStatus(event.id);
            statuses[event.id] = response.data;
          } catch (error) {
            // If not registered or error, set as null
            statuses[event.id] = null;
          }
        })
      );
      setRegistrationStatuses(statuses);
    } catch (error) {
      console.error('Error loading registration statuses:', error);
    }
  };

  const handleRegister = async (eventId) => {
    setRegistering(eventId);
    try {
      const result = await dispatch(registerForEvent(eventId)).unwrap();
      
      // Update registration status in state
      setRegistrationStatuses(prev => ({
        ...prev,
        [eventId]: result.registration
      }));
      
      // Try to download ticket
      try {
        const eventApi = await import('../../../api/eventApi');
        const response = await eventApi.default.downloadPdf(result.registration.id);
        
        // Since backend returns byte[] and API uses responseType: 'blob', 
        // response.data will be a Blob object
        const blob = response.data;
        
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket-${result.registration.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
      } catch (pdfError) {
        console.error('Error downloading ticket:', pdfError);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setRegistering(null);
    }
  };

  const handleUnregister = async (eventId , formId) => {
    if (window.confirm('Are you sure you want to unregister from this event?')) {
      try {
        await dispatch(unregisterFromEvent({ eventId, formId })).unwrap();

        // Update registration status in state
        setRegistrationStatuses(prev => ({
          ...prev,
          [eventId]: null
        }));
      } catch (error) {
        console.error('Unregistration failed:', error);
      }
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      setDeleting(eventId);
      try {
        await dispatch(deleteEvent(eventId)).unwrap();
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleRegistrationComplete = (registrationData) => {
    const eventId = registrationModal.eventId;
    setRegistrationModal({ show: false, eventId: null });
    
    // Update registration status in state
    if (registrationData) {
      setRegistrationStatuses(prev => ({
        ...prev,
        [eventId]: registrationData
      }));
    } else {
      // Registration was removed (unregistered)
      setRegistrationStatuses(prev => ({
        ...prev,
        [eventId]: null
      }));
    }
    
    loadEvents(); // Reload to update other event data
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getEventStatus = (event) => {
    // Handle backend structure with startDate/endDate
    if (!event || !event.startDate) {
      return { status: 'unknown', label: 'Unknown', color: 'bg-gray-500 text-gray-300' };
    }

    try {
      const now = new Date();
      const startDate = new Date(event.startDate);
      const endDate = event.endDate ? new Date(event.endDate) : startDate;

      // Check for invalid dates
      if (isNaN(startDate.getTime())) {
        return { status: 'unknown', label: 'Unknown', color: 'bg-gray-500 text-gray-300' };
      }

      // Check if event has ended
      if (endDate < now) {
        return { status: 'past', label: 'Past', color: 'bg-gray-500 text-gray-300' };
      } 
      // Check if event is currently happening
      else if (startDate <= now && endDate >= now) {
        return { status: 'ongoing', label: 'Live', color: 'bg-green-500 text-white' };
      }
      // Check if event starts today
      else if (startDate.toDateString() === now.toDateString()) {
        return { status: 'today', label: 'Today', color: 'bg-orange-500 text-white' };
      }
      // Future event
      else if (startDate > now) {
        const timeUntil = startDate - now;
        const daysUntil = Math.ceil(timeUntil / (1000 * 60 * 60 * 24));
        
        if (daysUntil <= 7) {
          return { status: 'soon', label: `${daysUntil}d left`, color: 'bg-yellow-500 text-white' };
        } else {
          return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-500 text-white' };
        }
      }
    } catch (error) {
      console.error('Error calculating event status:', error);
    }

    // Default fallback
    return { status: 'unknown', label: 'Unknown', color: 'bg-gray-500 text-gray-300' };
  };

  const hasCapacityLimit = (event) => {
    if (!event) return false;
    const cap = Number(event.maxParticipants);
    return Number.isFinite(cap) && cap > 0;
  };

  const getAvailableSpots = (event) => {
    if (!hasCapacityLimit(event)) return Infinity;
    
    // First check if we have available spots data from Redux store
    if (availableSpots[event.id] !== null && availableSpots[event.id] !== undefined) {
      return availableSpots[event.id];
    }
    
    // Fallback to calculating from event data
    const cap = Number(event.maxParticipants);
    const current = Number(event.currentRegistrations || event.currentParticipants || 0);
    return cap - current;
  };

  const isEventFull = (event) => {
    if (!event) return false;
    if (!hasCapacityLimit(event)) return false;
    return getAvailableSpots(event) <= 0;
  };

  if (eventsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-white">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6">
        <div className="text-red-300">{error}</div>
        <button
          onClick={() => dispatch(clearError())}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-4">
          <div className="text-green-300">{successMessage}</div>
        </div>
      )}

      {/* Events Grid */}
      {!events || events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {searchQuery ? 'No events found matching your search' : 'No events available'}
          </div>
          {filterType === 'my-created' && (
            <button
              onClick={() => navigate('/events/create')}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Create Your First Event
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.filter(event => event && event.id).map((event) => {
            // Debug log to help with development
            if (process.env.NODE_ENV === 'development') {
              console.log('Event data:', event);
            }
            
            const status = getEventStatus(event);
            const availableSpots = getAvailableSpots(event);
            const isFull = isEventFull(event);
            const isCreator = (
              event.isCreator ||
              event.createdByCurrentUser ||
              (event.createdBy?.id && user?.id && event.createdBy.id === user.id) ||
              (event.creatorId && user?.id && event.creatorId === user.id) ||
              (event.createdById && user?.id && event.createdById === user.id)
            );
            const isRegistered = registrationStatuses[event.id];

            return (
              <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                {/* Event Banner */}
                {event.bannerUrl && (
                  <div className="relative h-48">
                    <img
                      src={event.bannerUrl}
                      alt={event.title || 'Event banner'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      {event.status && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                          {event.status}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* If no banner, show status at top */}
                {!event.bannerUrl && (
                  <div className="p-3 border-b border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      {event.status && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                          {event.status}
                        </span>
                      )}
                    </div>
                  </div>
                )}


                
                <div className="p-6">
                  {/* Event Title and University */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {event.title || 'Untitled Event'}
                    </h3>
                    {event.university && (
                      <span className="bg-purple-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                        {event.university.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>

                  {/* Creator Info */}
                  {event.createdByUsername && (
                    <div className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3 mb-4">
                      <div className="flex items-center text-sm text-gray-300">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg overflow-hidden">
                          {event.createdByProfilePictureUrl ? (
                            <img 
                              src={event.createdByProfilePictureUrl} 
                              alt="Creator profile"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-full h-full flex items-center justify-center text-white font-semibold text-xs ${
                              event.createdByProfilePictureUrl ? 'hidden' : 'flex'
                            }`}
                          >
                            {event.createdByUsername.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <span className="font-medium">
                          {event.createdByUsername}
                        </span>
                      </div>
                      {isCreator && (
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg animate-pulse">
                          Your Event
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Event Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {event.description || 'No description available'}
                  </p>
                  
                  {/* Event Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <div className="flex flex-col">
                        <span>{formatDate(event.startDate)}</span>
                        {event.endDate && event.endDate !== event.startDate && (
                          <span className="text-xs text-gray-400">to {formatDate(event.endDate)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span className="truncate">{event.location || 'Location TBD'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-4 h-4 text-purple-400" />
                      {hasCapacityLimit(event) ? (
                        <span className={availableSpots <= 5 && availableSpots > 0 ? 'text-yellow-400' : isFull ? 'text-red-400' : 'text-green-400'}>
                          {Math.max(0, availableSpots)} / {event.maxParticipants} spots
                        </span>
                      ) : (
                        <span className="text-green-400">Unlimited spots</span>
                      )}
                    </div>

                    {/* Attachment Download */}
                    {event.attachmentUrl && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <a 
                          href={event.attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline text-sm"
                        >
                          Event Attachment
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Registration Status */}
                  {isRegistered && (
                    <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-2 mb-4">
                      <div className="text-green-300 text-sm text-center">Registered</div>
                    </div>
                  )}

                  {isFull && !isRegistered && (
                    <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-2 mb-4">
                      <div className="text-red-300 text-sm text-center">Event Full</div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>

                    {/* Creator Actions */}
                    {isCreator ? (
                      <>
                        <button
                          onClick={() => setEditModal({ show: true, eventId: event.id })}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/events/${event.id}/registrations`)}
                          className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                        >
                          <Users className="w-4 h-4" />
                          {event.currentRegistrations || event.currentParticipants || 0}
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          disabled={deleting === event.id}
                          className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      /* Participant Actions */
                      <>
                        {isRegistered ? (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  const { default: eventApi } = await import('../../../api/eventApi');
                                  const formRes = await eventApi.getRegistrationStatus(event.id);
                                  // {console.log(formRes.data + "++++++++++++++++++++++++++++++++++++++++")
                                  // }
                                  setSubmissionModal({ show: true, eventId: event.id, formId: formRes.data });
                                } catch (e) {
                                  console.error('No active form or failed to load:', e);
                                  // Fallback: navigate to my registrations
                                  navigate('/events/registrations');
                                }
                              }}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              View/Edit Response
                            </button>
                            <button
                              onClick={() => handleUnregister(event.id, isRegistered)}
                              className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                            >
                              Unregister
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setRegistrationModal({ show: true, eventId: event.id })}
                            disabled={
                              isFull || 
                              status.status === 'past' || 
                              registering === event.id ||
                              (event.status && event.status !== 'PUBLISHED')
                            }
                            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {registering === event.id ? 'Registering...' : 
                             (event.status && event.status !== 'PUBLISHED') ? 'Not Available' : 
                             'Register'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => dispatch(fetchEvents({ page: currentPage - 1, size: limit, searchQuery, filterType }))}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <span className="px-4 py-2 bg-gray-800 text-white rounded-lg">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <button
            onClick={() => dispatch(fetchEvents({ page: currentPage + 1, size: limit, searchQuery, filterType }))}
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Registration Modal */}
      {registrationModal.show && (
        <EventRegistrationModal
          eventId={registrationModal.eventId}
          show={registrationModal.show}
          onClose={() => setRegistrationModal({ show: false, eventId: null })}
          onRegistrationComplete={handleRegistrationComplete}
        />
      )}

      {/* Form Submission Modal for editing existing response */}
      {submissionModal.show && (
        <DynamicFormSubmission
          eventId={submissionModal.eventId}
          formId={submissionModal.formId}
          existingSubmission={true}
          onSubmissionComplete={() => setSubmissionModal({ show: false, eventId: null, formId: null })}
          onClose={() => setSubmissionModal({ show: false, eventId: null, formId: null })}
        />
      )}

      {/* Edit Modal */}
      {editModal.show && (
        <EditEventModal
          eventId={editModal.eventId}
          show={editModal.show}
          onClose={() => setEditModal({ show: false, eventId: null })}
          onEventUpdated={() => {
            setEditModal({ show: false, eventId: null });
            loadEvents();
          }}
        />
      )}
    </div>
  );
};

export default EnhancedEventList;