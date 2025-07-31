import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useOutletContext } from 'react-router-dom';

const CreateSessionForm = () => {
  const { token } = useAuth();
  const { courses, sessions, setSessions } = useOutletContext();
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    date: '',
    time: '',
    platform: '',
    customPlatform: '',
    link: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.title.trim()) newErrors.title = 'Session title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (formData.platform === 'Other' && !formData.customPlatform.trim()) {
      newErrors.customPlatform = 'Custom platform name is required';
    }
    if (!formData.link.trim()) newErrors.link = 'Meeting link is required';
    if (formData.link && !isValidURL(formData.link)) {
      newErrors.link = 'Please enter a valid meeting link (must start with http:// or https://)';
    }
    const scheduledAt = new Date(`${formData.date}T${formData.time}:00`);
    if (formData.date && formData.time && (isNaN(scheduledAt.getTime()) || scheduledAt <= new Date())) {
      newErrors.date = 'Scheduled date and time must be in the future';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      const errorMessages = Object.values(errors).filter(Boolean).join(', ');
      toast.error(`Please fix the following errors: ${errorMessages}`);
      return;
    }

    setIsSubmitting(true);
    const sessionData = {
      courseId: formData.courseId,
      title: formData.title,
      description: formData.description,
      scheduledAt: new Date(`${formData.date}T${formData.time}:00`).toISOString(),
      platform: formData.platform === 'Other' ? formData.customPlatform : formData.platform,
      link: formData.link,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/livesession`, sessionData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions([...sessions, response.data.session]);
      toast.success('Session created successfully!');
      setFormData({
        courseId: '',
        title: '',
        description: '',
        date: '',
        time: '',
        platform: '',
        customPlatform: '',
        link: '',
      });
      setErrors({});
    } catch (error) {
      const errorMsg = error.response?.data?.fields
        ? Object.values(error.response.data.fields).filter(Boolean).join(', ')
        : error.response?.data?.message || error.message;
      toast.error(`Failed to create session: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Create New Live Session</h2>
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {Object.values(errors).map((err, idx) => (
            <p key={idx}>{err}</p>
          ))}
        </div>
      )}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              disabled={isSubmitting}
            >
              <option value="">Select Course</option>
              {courses && courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
            {errors.courseId && <p className="text-red-500 text-xs mt-2">{errors.courseId}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Session Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter session title"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              disabled={isSubmitting}
            />
            {errors.title && <p className="text-red-500 text-xs mt-2">{errors.title}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter session description"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
            rows="4"
            disabled={isSubmitting}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              disabled={isSubmitting}
            />
            {errors.date && <p className="text-red-500 text-xs mt-2">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              disabled={isSubmitting}
            />
            {errors.time && <p className="text-red-500 text-xs mt-2">{errors.time}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Platform</label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              disabled={isSubmitting}
            >
              <option value="">Select Platform</option>
              <option value="Google Meet">Google Meet</option>
              <option value="Zoom">Zoom</option>
              <option value="Microsoft Teams">Microsoft Teams</option>
              <option value="Other">Other</option>
            </select>
            {errors.platform && <p className="text-red-500 text-xs mt-2">{errors.platform}</p>}
            {formData.platform === 'Other' && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Platform Name</label>
                <input
                  type="text"
                  name="customPlatform"
                  value={formData.customPlatform}
                  onChange={handleChange}
                  placeholder="Enter custom platform name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
                  disabled={isSubmitting}
                />
                {errors.customPlatform && <p className="text-red-500 text-xs mt-2">{errors.customPlatform}</p>}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Link</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Enter meeting link (e.g., https://meet.google.com/xyz)"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              disabled={isSubmitting}
            />
            {errors.link && <p className="text-red-500 text-xs mt-2">{errors.link}</p>}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Session'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionForm;