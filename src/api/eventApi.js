import apiClient from './apiClient';

const BASE_URL = '/events';

const eventApi = {
  getAllEvents: async (page = 0, size = 20, sortBy = 'date', sortDirection = 'asc') => {
  return apiClient.get(`${BASE_URL}/`, {
    params: { page, size, sortBy, sortDirection }
  });
},


  getEventById: async (id) => {
    return apiClient.get(`${BASE_URL}/${id}`);
  },

  searchEvents: async (keyword, page = 0, size = 20) => {
    return apiClient.get(`${BASE_URL}/search`, { params: { keyWord: keyword, page, size } });
  },

  getUpcomingEvents: async () => {
    return apiClient.get(`${BASE_URL}/upcoming`);
  },

  getPastEvents: async () => {
    return apiClient.get(`${BASE_URL}/past`);
  },

  getEventsByDateRange: async (startDate, endDate) => {
    return apiClient.get(`${BASE_URL}/dateRange`, { params: { startDate, endDate } });
  },

  getPopularEvents: async (limit = 10) => {
    return apiClient.get(`${BASE_URL}/popular`, { params: { limit } });
  },

  getMyCreatedEvents: async () => {
    return apiClient.get(`${BASE_URL}/my-created`);
  },

  createEvent: async (eventData) => {
    return apiClient.post(`${BASE_URL}/`, eventData);
  },

  updateEvent: async (id, eventData) => {
    return apiClient.put(`${BASE_URL}/${id}`, eventData);
  },

  deleteEvent: async (id) => {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  getEventRegistrationCount: async (eventId) => {
    return apiClient.get(`${BASE_URL}/registration-count/${eventId}`);
  },

  getAvailableSpots: async (eventId) => {
    return apiClient.get(`${BASE_URL}/available-spots/${eventId}`);
  },

  isEventFull: async (eventId) => {
    return apiClient.get(`${BASE_URL}/is-full/${eventId}`);
  },

  isEventActive: async (eventId) => {
    return apiClient.get(`${BASE_URL}/is-active/${eventId}`);
  },

  // Registration endpoints
  registerForEvent: async (eventId) => {
    return apiClient.post(`/register/${eventId}`);
  },

  unregisterFromEvent: async (eventId) => {
    return apiClient.delete(`${BASE_URL}/${eventId}/unregister`);
  },

  getMyRegistrations: async () => {
    return apiClient.get(`${BASE_URL}/my-registrations`);
  },

  getEventRegistrations: async (eventId) => {
    return apiClient.get(`${BASE_URL}/${eventId}/registrations`);
  },

  // Additional endpoints
  getTotalActiveEventsCount: async () => {
    return apiClient.get(`${BASE_URL}/total-active-count`);
  },

  getEventsByCreatorCount: async (creatorId) => {
    return apiClient.get(`${BASE_URL}/creator-count/${creatorId}`);
  },

  isUserEventCreator: async (eventId) => {
    return apiClient.get(`${BASE_URL}/is-creator/${eventId}` );
  },

  getEventCreator: async (eventId) => {
    return apiClient.get(`${BASE_URL}/creator/${eventId}`);
  },

  // getEventsCreatedByUser: async (userId) => {
  //   return apiClient.get(`${BASE_URL}/createdBy/${userId}`);
  // }
};

export default eventApi;
