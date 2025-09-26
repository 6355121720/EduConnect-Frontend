import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  FileText, 
  Edit, 
  Trash2, 
  Download, 
  Settings,
  ArrowLeft,
  ExternalLink,
  Share2,
  TrendingUp,
  UserCheck
} from 'lucide-react';


import { fetchEventById, clearSuccessMessage , fetchAvailableSpots } from '../../../store/slices/eventsSlice';
import EventRegistrationModal from '../components/EventRegistrationModal';
import FormBuilder from '../components/FormBuilder';
import DynamicFormSubmission from '../components/DynamicFormSubmission';
import eventApi from '../../../api/eventApi';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    availableSpots
  } = useSelector(state => state.events);
  
  const { currentEvent: event, loading, error, successMessage } = useSelector(state => state.events);
  
  const { user } = useSelector(state => state.auth);
  
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [showSubmissionEditor, setShowSubmissionEditor] = useState(false);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventById(eventId)); 
    }
  }, [eventId, dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => dispatch(clearSuccessMessage()), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  useEffect(() =>{
    dispatch(fetchAvailableSpots([eventId]));
  },[showRegistrationModal])

  // const getAvailableSpots = (event) => {
  //   if (!hasCapacityLimit(event)) return Infinity;
    
  //   // First check if we have available spots data from Redux store
  //   if (availableSpots[event.id] !== null && availableSpots[event.id] !== undefined) {
  //     return availableSpots[event.id];
  //   }
    
  //   // Fallback to calculating from event data
  //   const cap = Number(event.maxParticipants);
  //   const current = Number(event.currentRegistrations || event.currentParticipants || 0);
  //   return cap - current;
  // };

  const loadSupplemental = async () => {
    try {
      const [creatorRes, statusRes, formRes] = await Promise.allSettled([
        eventApi.isUserEventCreator(eventId),
        eventApi.getRegistrationStatus(eventId),
        eventApi.getActiveForm(eventId)
      ]);
      setIsCreator(creatorRes.status === 'fulfilled' ? !!creatorRes.value.data : false);
      setRegistrationStatus(statusRes.status === 'fulfilled' ? statusRes.value.data : null);
      setActiveForm(formRes.status === 'fulfilled' ? formRes.value.data : null);
    } catch {
      // ignore
    }
  };

  const handleRegistrationComplete = () => {
    setShowRegistrationModal(false);
    loadSupplemental();
  };

  const handleUnregister = async () => {
    if (!window.confirm('Are you sure you want to unregister from this event?')) {
      return;
    }

    
      
    
    try {
      await eventApi.deleteFormFromSubmission(eventId , registrationStatus);
      loadSupplemental();
      dispatch(fetchAvailableSpots([eventId]));
    } catch (error) {
      console.error('Error unregistering:', error);
      alert('Failed to unregister from event');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasCapacityLimit = () => {
    if (!event) return false;
    const cap = Number(event.maxParticipants);
    return Number.isFinite(cap) && cap > 0;
  };

  // const getAvailableSpots = () => {
  //   if (!hasCapacityLimit()) return Infinity;
    
  //   // First check if we have available spots data from Redux store
  //   if (availableSpots[eventId] !== null && availableSpots[eventId] !== undefined) {
  //     return availableSpots[eventId];
  //   }
    
  //   // Fallback to calculating from event data
  //   const cap = Number(event.maxParticipants);
  //   const current = Number(event.currentRegistrations || event.currentParticipants || 0);
  //   return cap - current;
  // };

  const isEventFull = hasCapacityLimit() ? availableSpots[event.id] <= 0 : false;
  const isEventPast = new Date(event?.endDate) < new Date();
  const isAlreadyRegistered = registrationStatus;
  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventById(eventId));
      loadSupplemental();
    }
    
  }, [eventId, dispatch]);

  if (loading && !event) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error || 'Event not found'}</div>
          <button
            onClick={() => navigate('/events')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-white">{event.title}</h1>
        </div>

        {/* Banner Image */}
        {event.bannerUrl && (
          <div className="mb-6">
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Event Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-gray-400">Start Date</div>
                    <div>{formatDate(event.startDate)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-gray-400">End Date</div>
                    <div>{formatDate(event.endDate)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-gray-400">Location</div>
                    <div>{event.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-300">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-gray-400">Available Spots</div>
                    {hasCapacityLimit() ? (
                      <div className={availableSpots[event.id] <= 5 && getAvailableSpots() > 0 ? 'text-yellow-400' : isEventFull ? 'text-red-400' : 'text-green-400'}>
                        {Math.max(0, availableSpots[event.id])} / {event.maxParticipants}
                      </div>
                    ) : (
                      <div className="text-green-400">Unlimited spots</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-gray-300">
                <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                <p className="whitespace-pre-wrap">{event.description}</p>
              </div>
              
              {event.attachmentUrl && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white mb-2">Attachments</h3>
                  <a
                    href={event.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
                  >
                    <Download className="w-4 h-4" />
                    View Attachment
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Creator Analytics */}
            {isCreator && analytics && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Event Analytics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{analytics.totalRegistrations || 0}</div>
                    <div className="text-gray-400 text-sm">Total Registrations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{getAvailableSpots()}</div>
                    <div className="text-gray-400 text-sm">Available Spots</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{analytics.viewCount || 0}</div>
                    <div className="text-gray-400 text-sm">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {Math.round(((registrationStatus?.currentRegistrations || 0) / event.maxParticipants) * 100)}%
                    </div>
                    <div className="text-gray-400 text-sm">Capacity</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Registration</h3>
              
              {/* Registration Status */}
              {isAlreadyRegistered ? (
                <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-green-300 mb-2">
                    <FileText className="w-5 h-5" />
                    <span>Registered</span>
                  </div>
                  <div className="text-gray-300 text-sm mb-3">
                    You are registered for this event
                  </div>
                  <div className="flex gap-2">
                    {activeForm && (
                      <button
                        onClick={() => setShowSubmissionEditor(true)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        View/Edit Response
                      </button>
                    )}
                    <button
                      onClick={handleUnregister}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Unregister
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {isEventFull && (
                    <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-4">
                      <div className="text-red-300 text-center">Event is Full</div>
                    </div>
                  )}
                  
                  {isEventPast && (
                    <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-4 mb-4">
                      <div className="text-yellow-300 text-center">Event has ended</div>
                    </div>
                  )}
                  
                  {!isEventFull && !isEventPast && !isCreator && (
                    <button
                      onClick={() => setShowRegistrationModal(true)}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Register Now
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Creator Actions */}
            {isCreator && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Creator Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/events/${eventId}/edit`)}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Event
                  </button>
                  
                  <button
                    onClick={() => setShowFormBuilder(true)}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <FileText className="w-4 h-4" />
                    {activeForm ? 'Edit Form' : 'Create Form'}
                  </button>
                  
                  <button
                    onClick={() => navigate(`/events/${eventId}/registrations`)}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Users className="w-4 h-4" />
                    View Registrations
                  </button>
                </div>
              </div>
            )}

            {/* Form Information */}
            {activeForm && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Registration Form</h3>
                <div className="text-gray-300 text-sm mb-3">
                  {activeForm.map((responcemp, index) => (
                    <div key={index} className="mb-4">
                      {/* Title */}
                      <div className="font-medium">{responcemp.title}</div>

                      {/* Deadline */}
                      {responcemp.deadline && (
                        <div className="text-gray-400 mt-1">
                          Deadline: {new Date(responcemp.deadline).toLocaleString()}
                        </div>
                      )}

                      {/* Active / Inactive badge */}
                      <div
                        className={`px-3 py-1 rounded-full text-xs inline-block ${
                          responcemp.isActive
                            ? 'bg-green-500 bg-opacity-20 text-green-300'
                            : 'bg-red-500 bg-opacity-20 text-red-300'
                        }`}
                      >
                        {responcemp.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <EventRegistrationModal
          eventId={eventId}
          show={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          onRegistrationComplete={handleRegistrationComplete}
        />
      )}

      {/* Form Builder Modal */}
      {showFormBuilder && (
        activeForm.map((response, index) => (
          <FormBuilder
            key={index} // always give a key when mapping in React
            eventId={eventId}
            form={response}
            onFormSaved={() => {
              setShowFormBuilder(false);
              loadSupplemental();
            }}
            onClose={() => setShowFormBuilder(false)}
          />
        ))

        
      )}

      {/* Submission editor for registered users */}
      {showSubmissionEditor && activeForm && (
        <DynamicFormSubmission
          eventId={eventId}
          formId={isAlreadyRegistered}
          existingSubmission={true}
          onSubmissionComplete={() => setShowSubmissionEditor(false)}
          onClose={() => setShowSubmissionEditor(false)}
        />
      )}
    </div>
  );
};

export default EventDetailPage;