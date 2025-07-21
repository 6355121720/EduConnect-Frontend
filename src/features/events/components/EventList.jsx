import React, { useState, useEffect } from 'react';
import eventApi from '../../../api/eventApi';
import EditEventModal from './EditEventModal';

const EventList = ({ searchQuery, filterType, dateRange, creatorFilter }) => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const [unregistering, setUnregistering] = useState(null);
  const [error, setError] = useState(null);
  const [creatorInfo, setCreatorInfo] = useState({});
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchRegisteredEvents();
  }, [page, searchQuery, filterType, dateRange, creatorFilter]);

  // Auto-dismiss success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleRegister = async eventId => {
    try {
      setRegistering(eventId);
      setError(null);
      await eventApi.registerForEvent(eventId);
      await Promise.all([fetchEvents(), fetchRegisteredEvents()]);
      setSuccessMessage('Successfully registered for event!');
    } catch (error) {
      console.error('Error registering for event:', error);
      setError(error.response?.data?.message || 'Failed to register for event');
    } finally {
      setRegistering(null);
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      const response = await eventApi.getMyRegistrations();
      setRegisteredEvents(response.data);
    } catch (error) {
      console.error('Error fetching registered events:', error);
    }
  };

  const handleEdit = eventId => {
    setEditingEvent(eventId);
    setShowEditModal(true);
  };

  const handleEventUpdated = () => {
    setShowEditModal(false);
    setEditingEvent(null);
    fetchEvents();
    setSuccessMessage('Event updated successfully!');
  };

  const handleUnregister = async eventId => {
    try {
      setUnregistering(eventId);
      setError(null);
      await eventApi.unregisterFromEvent(eventId);
      await Promise.all([fetchEvents(), fetchRegisteredEvents()]);
      setSuccessMessage('Successfully unregistered from event!');
    } catch (error) {
      console.error('Error unregistering from event:', error);
      setError(
        error.response?.data?.message || 'Failed to unregister from event'
      );
    } finally {
      setUnregistering(null);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let response;

      if (dateRange && dateRange.startDate && dateRange.endDate) {
        response = await eventApi.getEventsByDateRange(
          dateRange.startDate,
          dateRange.endDate
        );
      } else if (creatorFilter) {
        response = await eventApi.getEventsCreatedByUser(creatorFilter);
      } else if (searchQuery) {
        response = await eventApi.searchEvents(searchQuery, page, 9);
      } else {
        switch (filterType) {
          case 'upcoming':
            response = await eventApi.getUpcomingEvents();
            break;
          case 'past':
            response = await eventApi.getPastEvents();
            break;
          case 'popular':
            response = await eventApi.getPopularEvents();
            break;
          default:
            response = await eventApi.getAllEvents(page, 9);
        }
      }

      console.log('Events response:', response.data);
      setEvents(response.data.content || response.data);
      setTotalPages(response.data.totalPages || 1);

      const eventList = response.data.content || response.data;
      if (Array.isArray(eventList)) {
        const creatorPromises = eventList.map(async event => {
          try {
            const [creatorResponse, isCreatorResponse] = await Promise.all([
              eventApi.getEventCreator(event.id),
              eventApi.isUserEventCreator(event.id),
            ]);
            return {
              eventId: event.id,
              creator: creatorResponse.data,
              isCurrentUserCreator: isCreatorResponse.data,
            };
          } catch (error) {
            console.error(
              `Error fetching creator info for event ${event.id}:`,
              error
            );
            return {
              eventId: event.id,
              creator: null,
              isCurrentUserCreator: false,
            };
          }
        });

        const creatorResults = await Promise.all(creatorPromises);
        const creatorMap = {};
        creatorResults.forEach(result => {
          creatorMap[result.eventId] = result;
        });
        setCreatorInfo(creatorMap);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const isUserRegistered = event => {
    if (!event || !event.id) return false;
    return registeredEvents.some(regEvent => regEvent.eventId === event.id);
  };

  const getEventStatus = event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      return { status: 'past', label: 'Past Event', color: 'bg-gray-500' };
    } else if (eventDate.toDateString() === today.toDateString()) {
      return { status: 'today', label: 'Today', color: 'bg-orange-500' };
    } else {
      const diffTime = Math.abs(eventDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) {
        return { status: 'soon', label: `In ${diffDays} day${diffDays > 1 ? 's' : ''}`, color: 'bg-yellow-500' };
      } else {
        return { status: 'upcoming', label: 'Upcoming', color: 'bg-green-500' };
      }
    }
  };

  const getParticipationPercentage = event => {
    return ((event.currentParticipants || 0) / event.maxParticipants) * 100;
  };

  const dismissError = () => setError(null);
  const dismissSuccess = () => setSuccessMessage(null);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
        <p className="text-gray-400 animate-pulse">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="mb-4">
          <svg className="h-16 w-16 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No events found</h3>
        <p className="text-gray-500 max-w-md">
          {searchQuery ? `No events match your search for "${searchQuery}"` : 
           filterType ? `No ${filterType} events available` : 
           'No events are currently available'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
          <button onClick={dismissSuccess} className="text-green-400 hover:text-green-300">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
          <button onClick={dismissError} className="text-red-400 hover:text-red-300">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const isRegistered = isUserRegistered(event);
          const isFull = (event.currentParticipants || 0) >= event.maxParticipants;
          const isProcessing = registering === event.id || unregistering === event.id;
          const eventCreatorInfo = creatorInfo[event.id];
          const isCurrentUserCreator = eventCreatorInfo?.isCurrentUserCreator || false;
          const eventStatus = getEventStatus(event);
          const participationPercentage = getParticipationPercentage(event);

          return (
            <div
              key={event.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 group"
            >
              {/* Card Header */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-200 line-clamp-2">
                      {event.title}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className="bg-purple-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                      {event.university}
                    </span>
                    <span className={`${eventStatus.color} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                      {eventStatus.label}
                    </span>
                  </div>
                </div>

                {/* Creator Info */}
                {(eventCreatorInfo?.creator || event.createdByUsername) && (
                  <div className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3">
                    <div className="flex items-center text-sm text-gray-300">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg overflow-hidden">
                        {event.createdByProfilePictureUrl ? (
                          <img 
                            src={event.createdByProfilePictureUrl} 
                            alt="Creator profile"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
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
                          {event.createdByUsername ? 
                            event.createdByUsername.charAt(0).toUpperCase() : 
                            eventCreatorInfo?.creator ? 
                              (eventCreatorInfo.creator.firstName?.charAt(0) || '') + (eventCreatorInfo.creator.lastName?.charAt(0) || '') :
                              '?'
                          }
                        </div>
                      </div>
                      <span className="font-medium">
                        {event.createdByUsername || 
                         (eventCreatorInfo?.creator && 
                          `${eventCreatorInfo.creator.firstName || ''} ${eventCreatorInfo.creator.lastName || ''}`.trim()) ||
                         'Unknown Creator'
                        }
                      </span>
                    </div>
                    {isCurrentUserCreator && (
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg animate-pulse">
                        Your Event
                      </span>
                    )}
                  </div>
                )}


                {/* Description */}
                <p className="text-gray-400 leading-relaxed line-clamp-3">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-3">
                  {/* Date */}
                  <div className="flex items-center text-gray-300">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-medium">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Participants with Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-gray-300">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">
                          {event.currentParticipants || 0} / {event.maxParticipants} participants
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {Math.round(participationPercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          participationPercentage >= 90 ? 'bg-red-500' :
                          participationPercentage >= 70 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(participationPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4">
                  {isCurrentUserCreator ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => handleEdit(event.id)}
                        className="w-full py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Event
                      </button>
                      <p className="text-center text-sm text-gray-400">
                        You are the event creator
                      </p>
                    </div>
                  ) : isRegistered ? (
                    <button
                      onClick={() => handleUnregister(event.id)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                        unregistering === event.id
                          ? 'bg-red-400 text-white cursor-wait'
                          : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                      }`}
                      disabled={isProcessing}
                    >
                      {unregistering === event.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Unregistering...
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Unregister
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(event.id)}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                        registering === event.id
                          ? 'bg-purple-400 text-white cursor-wait'
                          : isFull
                          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800'
                      }`}
                      disabled={isFull || isProcessing}
                    >
                      {registering === event.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Registering...
                        </>
                      ) : isFull ? (
                        <>
                          <svg className="h-4 w-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                          </svg>
                          Event Full
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Register
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                page === 0
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  page === idx
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                page === totalPages - 1
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      <EditEventModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEventUpdated={handleEventUpdated}
        eventId={editingEvent}
      />
    </div>
  );
};

export default EventList;