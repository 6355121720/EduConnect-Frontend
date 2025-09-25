import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Filter, Calendar, Users, Plus, X } from 'lucide-react';
import EnhancedEventList from '../components/EnhancedEventList';
import CreateEventModal from '../components/CreateEventModal';
import { setSearchQuery, setFilterType } from '../../../store/slices/eventsSlice';

const EnhancedEventsPage = () => {
  const dispatch = useDispatch();
  const { searchQuery, filterType } = useSelector(state => state.events);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

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
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Discover Educational Events</h1>
          <p className="text-gray-400 mt-1">Find and join events in your area</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Link
            to="/events/my-registrations"
            className="flex-1 md:flex-none bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <Users className="w-5 h-5" />
            My Registrations
          </Link>
          <button
            onClick={handleCreateEvent}
            className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-2.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="popular">Popular</option>
            <option value="my-created">My Created Events</option>
          </select>
          
          <button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Filter className={`w-5 h-5 transition-transform ${showAdvancedSearch ? 'rotate-180' : ''}`} />
            {showAdvancedSearch ? 'Hide Filters' : 'More Filters'}
          </button>
        </div>

        {/* Advanced Search Panel */}
        {showAdvancedSearch && (
          <div className="mt-6 bg-gray-750 rounded-lg p-5 space-y-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Advanced Filters
              </h3>
              <button
                onClick={() => setShowAdvancedSearch(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Filters Section */}
            {(searchQuery || filterType !== 'all') && (
              <div className="border-t border-gray-700 pt-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-gray-400">Active filters:</span>
                  
                  {searchQuery && (
                    <div className="flex items-center bg-purple-900/50 text-purple-200 px-3 py-1.5 rounded-full text-sm">
                      <span>Search: {searchQuery}</span>
                      <button 
                        onClick={() => handleSearchChange('')}
                        className="ml-2 text-purple-400 hover:text-purple-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {filterType !== 'all' && (
                    <div className="flex items-center bg-blue-900/50 text-blue-200 px-3 py-1.5 rounded-full text-sm">
                      <span>Type: {filterType}</span>
                      <button 
                        onClick={() => handleFilterChange('all')}
                        className="ml-2 text-blue-400 hover:text-blue-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Event List */}
      <EnhancedEventList 
        searchQuery={searchQuery}
        filterType={filterType}
        showPagination={true}
        limit={9}
      />

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  );
};

export default EnhancedEventsPage;