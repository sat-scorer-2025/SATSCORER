import React, { useState } from 'react';
import VideoTab from './VideoTab';
import NotesTab from './NotesTab';

const CourseContentTab = () => {
  const [activeTab, setActiveTab] = useState('videos');

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Content</h2>
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === 'videos'
                ? 'border-b-2 border-teal-500 text-teal-600'
                : 'text-gray-600 hover:text-teal-600'
            }`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
          <button
            className={`px-4 py-2 text-sm font-semibold ${
              activeTab === 'notes'
                ? 'border-b-2 border-teal-500 text-teal-600'
                : 'text-gray-600 hover:text-teal-600'
            }`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </div>
        <div className="mt-4">
          {activeTab === 'videos' && <VideoTab />}
          {activeTab === 'notes' && <NotesTab />}
        </div>
      </div>
    </div>
  );
};

export default CourseContentTab;
