import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';

const EditSessionDialog = () => {
  const { token } = useAuth();
  const { sessionId } = useParams();
  const navigate = useNavigate();
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
  const [sessionNotFound, setSessionNotFound] = useState(false);

  useEffect(() => {
    const session = sessions.find((s) => s._id === sessionId);
    if (session) {
      setFormData({
        courseId: session.courseId?._id || session.courseId || '',
        title: session.title || '',
        description: session.description || '',
        date: new Date(session.scheduledAt).toISOString().split('T')[0] || '',
        time: new Date(session.scheduledAt).toTimeString().slice(0, 5) || '',
        platform: ['Google Meet', 'Zoom', 'Microsoft Teams'].includes(session.platform) ? session.platform : 'Other',
        customPlatform: ['Google Meet', 'Zoom', 'Microsoft Teams'].includes(session.platform) ? '' : session.platform,
        link: session.link || '',
      });
      setSessionNotFound(false);
    } else {
      console.warn('Session not found for ID:', sessionId);
      setSessionNotFound(true);
    }
  }, [sessionId, sessions]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
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
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (formData.platform === 'Other' && !formData.customPlatform.trim()) newErrors.customPlatform = 'Platform name is required';
    if (!formData.link.trim()) newErrors.link = 'Meeting link is required';
    if (formData.link && !isValidURL(formData.link)) {
      newErrors.link = 'Please enter a valid meeting link (must start with http:// or https://)';
    }
    const scheduledAt = new Date(`${formData.date}T${formData.time}:00`);
    if (isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
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
    try {
      const sessionData = {
        courseId: formData.courseId,
        title: formData.title,
        description: formData.description,
        scheduledAt: new Date(`${formData.date}T${formData.time}:00`).toISOString(),
        platform: formData.platform === 'Other' ? formData.customPlatform : formData.platform,
        link: formData.link,
      };
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/livesession/${sessionId}`,
        sessionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions(sessions.map((s) => (s._id === sessionId ? response.data.session : s)));
      toast.success('Session updated successfully!');
      navigate('/live/manage');
    } catch (error) {
      const errorMsg = error.response?.data?.fields
        ? Object.values(error.response.data.fields).filter(Boolean).join(', ')
        : error.response?.data?.message || error.message;
      toast.error(`Failed to update session: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    navigate('/live/manage');
  };

  if (sessionNotFound) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] border-2 border-red-500">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Session Not Found</h2>
          <p className="text-gray-600 mb-4">The session you are trying to edit does not exist.</p>
          <div className="flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to Manage Sessions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10] border-2">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Live Session</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {Object.values(errors).map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-teal-700 font-medium mb-1">Course</label>
              <select
                value={formData.courseId}
                onChange={(e) => handleChange('courseId', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                disabled={isSubmitting}
              >
                <option value="">Select Course</option>
                {courses && courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {errors.courseId && <p className="text-red-500 text-xs mt-1">{errors.courseId}</p>}
            </div>
            <div>
              <label className="block text-teal-700 font-medium mb-1">Session Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                placeholder="Enter session title"
                disabled={isSubmitting}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-teal-700 font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                placeholder="Enter session description"
                rows="3"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-teal-700 font-medium mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                disabled={isSubmitting}
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-teal-700 font-medium mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                disabled={isSubmitting}
              />
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>
            <div>
              <label className="block text-teal-700 font-medium mb-1">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                disabled={isSubmitting}
              >
                <option value="">Select Platform</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom">Zoom</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Other">Other</option>
              </select>
              {errors.platform && <p className="text-red-500 text-xs mt-1">{errors.platform}</p>}
            </div>
            {formData.platform === 'Other' && (
              <div>
                <label className="block text-teal-700 font-medium mb-1">Specify Platform</label>
                <input
                  type="text"
                  value={formData.customPlatform}
                  onChange={(e) => handleChange('customPlatform', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  placeholder="Enter platform name"
                  disabled={isSubmitting}
                />
                {errors.customPlatform && <p className="text-red-500 text-xs mt-1">{errors.customPlatform}</p>}
              </div>
            )}
            <div className="md:col-span-2">
              <label className="block text-teal-700 font-medium mb-1">Meeting Link</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => handleChange('link', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
                placeholder="Enter meeting link (e.g., https://meet.google.com/xyz)"
                disabled={isSubmitting}
              />
              {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleClose}
              className="px-4 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSessionDialog;