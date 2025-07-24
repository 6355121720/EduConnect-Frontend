import React from 'react';
import { Link } from 'react-router-dom';
import MyRegistrations from '../components/MyRegistrations';

const MyRegistrationsPage = () => {
  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Event Registrations</h1>
          <p className="text-gray-400">View and manage your event registrations</p>
        </div>
        <Link
          to="/events"
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>
      </div>

      <MyRegistrations />
    </div>
  );
};

export default MyRegistrationsPage;
