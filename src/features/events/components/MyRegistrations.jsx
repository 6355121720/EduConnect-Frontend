import React, { useState, useEffect } from 'react';
import eventApi from '../../../api/eventApi';
import { useNavigate } from 'react-router-dom';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    try {
      const response = await eventApi.getMyRegistrations();
      console.log(response);
      setRegistrations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setLoading(false);
    }
  };


  const [downloadingTicket, setDownloadingTicket] = useState(null);
  const [ticketError, setTicketError] = useState(null);

  const handleTicket = async reg_id => {
    try {
      setDownloadingTicket(reg_id);
      setTicketError(null);
      const response = await eventApi.downloadPdf(reg_id);
      
      // Handle direct PDF response from backend
      let blob;
      if (response.data instanceof Blob) {
        blob = response.data;
      } else {
        // If response.data is not already a blob, create one
        blob = new Blob([response.data], { type: 'application/pdf' });
      }
      
      const url = URL.createObjectURL(blob);
      
      // Create a temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${reg_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (pdfError) {
      console.error('Error downloading PDF:', pdfError);
      setTicketError('Failed to download ticket. Please try again.');
    } finally {
      setDownloadingTicket(null);
    }
  }

  const handleUnregister = async eventId => {
    try {
      await eventApi.unregisterFromEvent(eventId);
      fetchMyRegistrations(); // Refresh the list
    } catch (error) {
      console.error('Error unregistering:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">
          My Registered Events
        </h2>
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/20"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Browse Events
        </button>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-gray-800/50 rounded-xl p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-200 mb-3">
            No registered events
          </h3>
          <p className="text-gray-400 mb-6">
            You haven't registered for any events yet. Browse available events to get started!
          </p>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="grid gap-5">
          {registrations.map(registration => (
            <div
              key={registration.id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-white break-words">
                        {registration.eventTitle}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                          new Date(registration.eventDate) < new Date()
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-green-900/50 text-green-400'
                        }`}
                      >
                        {new Date(registration.eventDate) < new Date()
                          ? 'Past Event'
                          : 'Upcoming'}
                      </span>
                    </div>

                    <p className="text-gray-300 mb-6 line-clamp-3 hover:line-clamp-none transition-all duration-200">
                      {registration.eventDescription}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start text-gray-400">
                          <svg
                            className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <span>{registration.university}</span>
                        </div>

                        <div className="flex items-center text-gray-400">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {new Date(registration.eventDate).toLocaleString(
                              'en-US',
                              {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex items-start text-gray-400">
                          <svg
                            className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-300">Registration Date</span>
                            <span className="text-gray-400">
                              {new Date(registration.registrationDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-300">Participants</span>
                            <span className="text-gray-400">
                              {registration.currentParticipants}/{registration.maxParticipants}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(100, (registration.currentParticipants / registration.maxParticipants) * 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-0 w-full sm:w-auto justify-end items-center">
                    <button
                      onClick={() => handleTicket(registration.id)}
                      disabled={downloadingTicket === registration.id}
                      className={`w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 space-x-2
                        ${downloadingTicket === registration.id
                          ? 'bg-purple-100 text-purple-500 cursor-wait'
                          : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/20'
                        }`}
                    >
                      {downloadingTicket === registration.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span>Download Ticket</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleUnregister(registration.eventId)}
                      className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span>Unregister</span>
                    </button>
                  </div>
                  
                  <span className="text-xs text-gray-500">
                    ID: {registration.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
