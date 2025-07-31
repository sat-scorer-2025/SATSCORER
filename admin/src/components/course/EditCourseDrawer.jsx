import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const EditCourseDrawer = ({ course, onClose, onUpdate }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    exam: '',
    price: '',
    thumbnail: null,
    thumbnailPreview: null,
    about: '',
    isPublic: true,
    startDate: '',
    endDate: '',
    durationMonths: 0,
    maxSeats: 0,
    unlimitedSeats: false,
    status: 'draft',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        id: course._id || '',
        title: course.title || '',
        description: course.description || '',
        exam: course.examType || '',
        price: course.price || '',
        thumbnail: null,
        thumbnailPreview: course.thumbnail || 'https://via.placeholder.com/150',
        about: course.about || '',
        isPublic: course.visibility === 'public',
        startDate: course.startDate ? course.startDate.split('T')[0] : '',
        endDate: course.endDate ? course.endDate.split('T')[0] : '',
        durationMonths: 0,
        maxSeats: course.maxSeats || 0,
        unlimitedSeats: course.maxSeats === 0,
        status: course.status || 'draft',
      });
    }
  }, [course]);

  useEffect(() => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end > start) {
      let months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      if (end.getDate() < start.getDate()) {
        months -= 1;
      }
      setFormData((prev) => ({ ...prev, durationMonths: months }));
    } else {
      setFormData((prev) => ({ ...prev, durationMonths: 0 }));
    }
  }, [formData.startDate, formData.endDate]);

  useEffect(() => {
    return () => {
      if (formData.thumbnailPreview && formData.thumbnail) {
        URL.revokeObjectURL(formData.thumbnailPreview);
      }
    };
  }, [formData.thumbnailPreview, formData.thumbnail]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    const preview = file ? URL.createObjectURL(file) : formData.thumbnailPreview;
    setFormData((prev) => ({
      ...prev,
      thumbnail: file,
      thumbnailPreview: preview,
    }));
  };

  const handleUnlimitedChange = () => {
    setFormData((prev) => ({
      ...prev,
      unlimitedSeats: !prev.unlimitedSeats,
      maxSeats: !prev.unlimitedSeats ? 0 : '',
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.exam || !formData.price) {
      toast.error('Title, Exam Type, and Price are required.');
      return;
    }

    setIsSubmitting(true);
    const form = new FormData();
    form.append('title', formData.title);
    form.append('examType', formData.exam);
    form.append('price', Number(formData.price).toString());
    form.append('description', formData.description || '');
    form.append('about', formData.about || '');
    form.append('visibility', formData.isPublic ? 'public' : 'private');
    form.append('startDate', formData.startDate || '');
    form.append('endDate', formData.endDate || '');
    form.append('maxSeats', formData.unlimitedSeats ? '0' : Number(formData.maxSeats).toString());
    form.append('status', formData.status);
    if (formData.thumbnail) {
      form.append('thumbnail', formData.thumbnail);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/course/${formData.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      onUpdate(response.data.course);
      toast.success('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(error.response?.data?.message || 'Failed to update course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Edit Course</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
          disabled={isSubmitting}
        >
          ✕
        </button>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Course Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Title"
              disabled={isSubmitting}
            />
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Poster</label>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-200 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-none file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                disabled={isSubmitting}
              />
              {formData.thumbnailPreview && (
                <img
                  src={formData.thumbnailPreview}
                  alt="Preview"
                  className="mt-2 max-h-32 mx-auto object-contain border rounded"
                />
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Exam Type</label>
            <select
              name="exam"
              value={formData.exam}
              onChange={(e) => handleFieldChange('exam', e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isSubmitting}
            >
              <option value="">Select Exam</option>
              <option value="SAT">SAT</option>
              <option value="ACT">ACT</option>
              <option value="GRE">GRE</option>
              <option value="GMAT">GMAT</option>
              <option value="IELTS">IELTS</option>
            </select>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => handleFieldChange('price', e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Price in ₹"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Brief description..."
              disabled={isSubmitting}
            />
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">About the Course</label>
            <textarea
              name="about"
              rows={4}
              value={formData.about}
              onChange={(e) => handleFieldChange('about', e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Subjects, syllabus, structure..."
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-gray-600 font-medium mb-1">Visibility</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={() => handleFieldChange('isPublic', !formData.isPublic)}
                className="sr-only"
                disabled={isSubmitting}
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${
                    formData.isPublic ? 'left-6 bg-teal-500' : 'left-0.5 bg-gray-500'
                  }`}
                />
              </div>
              <span className="ml-3 text-gray-600 font-medium">
                {formData.isPublic ? 'Public' : 'Private'}
              </span>
            </label>
          </div>
        </div>
        <hr className="border-gray-200 my-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={(e) => handleFieldChange('startDate', e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isSubmitting}
            />
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Duration (Months)</label>
            <input
              type="text"
              value={formData.durationMonths}
              readOnly
              className="w-full p-3 border border-gray-200 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={(e) => handleFieldChange('endDate', e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isSubmitting}
            />
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Max Seats</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="maxSeats"
                value={formData.maxSeats}
                onChange={(e) => handleFieldChange('maxSeats', Number(e.target.value))}
                disabled={formData.unlimitedSeats || isSubmitting}
                min={0}
                className={`w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 ${
                  formData.unlimitedSeats ? 'bg-gray-100 cursor-not-allowed' : 'bg-white focus:ring-teal-500'
                }`}
              />
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.unlimitedSeats}
                  onChange={handleUnlimitedChange}
                  className="text-teal-500 focus:ring-teal-500 h-5 w-5"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-gray-600">Unlimited</span>
              </label>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-gray-600 font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={isSubmitting}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-sm"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourseDrawer;