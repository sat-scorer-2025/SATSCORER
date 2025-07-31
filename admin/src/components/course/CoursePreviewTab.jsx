import React from 'react';

const CoursePreviewTab = ({ formData }) => {
  return (
    <div className="space-y-6 max-w-sm mx-auto">
      <h3 className="text-xl font-semibold text-gray-800">Course Preview</h3>
      <div className="bg-white rounded-md shadow-md border border-gray-200 overflow-hidden">
        <div className="relative">
          <div className="absolute top-2 left-2 bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold z-10 select-none">
            Online
          </div>
          <img
            src={formData.thumbnailPreview || 'https://via.placeholder.com/150'}
            alt={`${formData.title} Thumbnail`}
            className="w-full h-44 object-cover"
          />
        </div>
        <div className="p-4 space-y-2">
          <h4 className="text-lg font-bold text-gray-800 truncate">{formData.title || 'Course Title'}</h4>
          <p className="text-sm text-gray-600">Exam Type: {formData.examType || 'N/A'}</p>
          <p className="text-sm text-gray-600">Start Date: {formData.startDate || 'N/A'}</p>
          <p className="text-sm text-gray-600">End Date: {formData.endDate || 'N/A'}</p>
          <p className="text-sm text-gray-600">Duration: {formData.durationMonths || 0} months</p>
          <p className="text-sm text-gray-600">Seats: {formData.unlimitedSeats ? 'Unlimited' : formData.maxSeats || 'N/A'}</p>
          <p className="text-sm text-gray-600">Visibility: {formData.visibility ? 'Public' : 'Private'}</p>
          <p className="text-md font-semibold text-gray-800">Price: {formData.price ? `₹${formData.price}` : 'Free'}</p>
          <p className="text-sm text-gray-600">About: {formData.about || 'N/A'}</p>
        </div>
        <div className="flex justify-between p-4 border-t border-gray-200 bg-gray-50">
          <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition-colors">
            Explore Course
          </button>
          <button className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePreviewTab;
