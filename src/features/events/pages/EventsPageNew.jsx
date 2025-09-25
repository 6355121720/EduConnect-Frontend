import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Calendar, Users, Plus } from 'lucide-react';
import EventList from '../components/EventList';
import CreateEventModal from '../components/CreateEventModal';
import { setSearchQuery, setFilterType } from '../../../store/slices/eventsSlice';

const EventsPage = () => {
  const dispatch = useDispatch();
  const { searchQuery, filterType } = useSelector(state => state.events);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [creatorFilter, setCreatorFilter] = useState(null);

  const handleCreateEvent = () => {
    setShowCreateModal(true);
  };

  const handleEventCreated = () => {
    setShowCreateModal(false);
    // Events will auto-refresh through Redux
  };

  const handleSearchChange = (value) => {
    dispatch(setSearchQuery(value));
  };

  const handleFilterChange = (value) => {
    dispatch(setFilterType(value));
  };

  const clearFilters = () => {
    dispatch(setSearchQuery(''));
    dispatch(setFilterType('all'));
    setDateRange({ startDate: '', endDate: '' });
    setCreatorFilter(null);
  };

  const handleDateRangeSearch = () => {
    // This could trigger a search with date range
    // For now, the EventList component will handle the dateRange prop
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-6">
      {/* Improved Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Discover Educational Events</h1>
          <p className="text-gray-400 mt-1">Find and join events in your area</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Link
            to="/events/registrations"
            className="flex-1 md:flex-none bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Registrations
          </Link>
          <button
            onClick={handleCreateEvent}
            className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </button>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className="mb-8 bg-gray-800 rounded-xl p-4 md:p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-2.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past Events</option>
            <option value="popular">Popular</option>
            <option value="all">All Events</option>
            <option value="my-created">My Created</option>
          </select>
          
          <button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg 
              className={`w-5 h-5 transition-transform ${showAdvancedSearch ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showAdvancedSearch ? 'Hide Filters' : 'More Filters'}
          </button>
        </div>

        {/* Enhanced Advanced Search Panel */}
        {showAdvancedSearch && (
          <div className="mt-6 bg-gray-750 rounded-lg p-5 space-y-6 border border-gray-700 animate-fadeIn">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date Range
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">End Date</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <button
                  onClick={handleDateRangeSearch}
                  disabled={!dateRange.startDate || !dateRange.endDate}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 h-[42px]"
                >
                  Apply Date Filter
                </button>
              </div>
            </div>

            {/* Active Filters Section */}
            {(searchQuery || dateRange.startDate || creatorFilter) && (
              <div className="pt-4 border-t border-gray-700">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-gray-400">Active filters:</span>
                  
                  {searchQuery && (
                    <div className="flex items-center bg-purple-900/50 text-purple-200 px-3 py-1.5 rounded-full text-sm">
                      <span>Search: {searchQuery}</span>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="ml-2 text-purple-400 hover:text-purple-200"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {dateRange.startDate && (
                    <div className="flex items-center bg-blue-900/50 text-blue-200 px-3 py-1.5 rounded-full text-sm">
                      <span>Dates: {dateRange.startDate} → {dateRange.endDate}</span>
                      <button 
                        onClick={() => setDateRange({ startDate: '', endDate: '' })}
                        className="ml-2 text-blue-400 hover:text-blue-200"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {creatorFilter && (
                    <div className="flex items-center bg-green-900/50 text-green-200 px-3 py-1.5 rounded-full text-sm">
                      <span>Creator Filter</span>
                      <button 
                        onClick={() => setCreatorFilter(null)}
                        className="ml-2 text-green-400 hover:text-green-200"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={clearFilters}
                    className="ml-auto text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event List */}
      <EventList 
        searchQuery={searchQuery}
        filterType={filterType}
        dateRange={dateRange.startDate && dateRange.endDate ? dateRange : null}
        creatorFilter={creatorFilter}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
};

export default EventsPage;
