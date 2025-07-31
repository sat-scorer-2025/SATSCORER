import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CourseContext } from '../../context/CourseContext';
import { toast } from 'react-toastify';
import CoursePreviewTab from './CoursePreviewTab';

const CreateCourseForm = () => {
  const { token } = useAuth();
  const { fetchCourses } = useContext(CourseContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    examType: '',
    price: '',
    thumbnail: null,
    thumbnailPreview: null,
    about: '',
    visibility: false,
    startDate: '',
    endDate: '',
    durationMonths: 0,
    maxSeats: 0,
    unlimitedSeats: false,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const examTypes = ['SAT', 'ACT', 'GRE', 'GMAT', 'IELTS', 'AP'];

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
      if (formData.thumbnailPreview) {
        URL.revokeObjectURL(formData.thumbnailPreview);
      }
    };
  }, [formData.thumbnailPreview]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    const preview = file ? URL.createObjectURL(file) : null;
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
      maxSeats: !prev.unlimitedSeats ? 0 : prev.maxSeats,
    }));
  };

  const handleSaveDraft = async () => {
    if (!formData.title || !formData.examType) {
      toast.error('Title and Exam Type are required to save a draft.');
      return;
    }

    setIsSubmitting(true);
    const form = new FormData();
    form.append('title', formData.title);
    form.append('examType', formData.examType);
    form.append('price', Number(formData.price) || 0);
    form.append('description', formData.description);
    form.append('about', formData.about);
    form.append('visibility', formData.visibility ? 'public' : 'private');
    form.append('startDate', formData.startDate);
    form.append('endDate', formData.endDate);
    form.append('maxSeats', formData.unlimitedSeats ? 0 : Number(formData.maxSeats));
    form.append('status', 'draft');
    if (formData.thumbnail) {
      form.append('thumbnail', formData.thumbnail);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/course`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Draft saved successfully!');
      await fetchCourses();
      setFormData({
        title: '',
        description: '',
        examType: '',
        price: '',
        thumbnail: null,
        thumbnailPreview: null,
        about: '',
        visibility: false,
        startDate: '',
        endDate: '',
        durationMonths: 0,
        maxSeats: 0,
        unlimitedSeats: false,
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error(error.response?.data?.message || 'Failed to save draft.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.examType || !formData.price) {
      toast.error('Title, Exam Type, and Price are required to publish.');
      return;
    }

    setIsSubmitting(true);
    const form = new FormData();
    form.append('title', formData.title);
    form.append('examType', formData.examType);
    form.append('price', Number(formData.price));
    form.append('description', formData.description);
    form.append('about', formData.about);
    form.append('visibility', formData.visibility ? 'public' : 'private');
    form.append('startDate', formData.startDate);
    form.append('endDate', formData.endDate);
    form.append('maxSeats', formData.unlimitedSeats ? 0 : Number(formData.maxSeats));
    form.append('status', 'published');
    if (formData.thumbnail) {
      form.append('thumbnail', formData.thumbnail);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/course`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Course published successfully!');
      await fetchCourses();
      setFormData({
        title: '',
        description: '',
        examType: '',
        price: '',
        thumbnail: null,
        thumbnailPreview: null,
        about: '',
        visibility: false,
        startDate: '',
        endDate: '',
        durationMonths: 0,
        maxSeats: 0,
        unlimitedSeats: false,
      });
    } catch (error) {
      console.error('Error publishing course:', error);
      toast.error(error.response?.data?.message || 'Failed to publish course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Course</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Course Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
              placeholder="Enter course title"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Thumbnail</label>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-white">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
              {formData.thumbnailPreview && (
                <img
                  src={formData.thumbnailPreview}
                  alt="Preview"
                  className="mt-4 max-h-32 mx-auto object-contain border border-gray-200 rounded"
                />
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Exam Type</label>
            <select
              value={formData.examType}
              onChange={(e) => handleFieldChange('examType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
            >
              <option value="">Select Exam</option>
              {examTypes.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleFieldChange('price', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
              placeholder="Enter price in ₹"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
              placeholder="Brief course description"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">About the Course</label>
            <textarea
              rows={4}
              value={formData.about}
              onChange={(e) => handleFieldChange('about', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
              placeholder="Enter subjects, syllabus, structure..."
            />
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-gray-600 font-medium mb-1">Visibility</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visibility}
                onChange={() => handleFieldChange('visibility', !formData.visibility)}
                className="sr-only"
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${
                    formData.visibility ? 'left-6 bg-teal-500' : 'left-0.5 bg-gray-500'
                  }`}
                />
              </div>
              <span className="ml-3 text-gray-600 font-medium">
                {formData.visibility ? 'Public' : 'Private'}
              </span>
            </label>
          </div>
        </div>
        <hr className="border-gray-200 my-6" />
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleFieldChange('startDate', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-medium mb-1">Duration (Months)</label>
            <input
              type="text"
              value={formData.durationMonths}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-semibold mb-1">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleFieldChange('endDate', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-800"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-gray-600 font-semibold mb-1">Max Seats</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={formData.maxSeats}
                onChange={(e) => handleFieldChange('maxSeats', Number(e.target.value))}
                disabled={formData.unlimitedSeats}
                min="0"
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  formData.unlimitedSeats ? 'bg-gray-100 cursor-not-allowed' : 'bg-white focus:ring-teal-500'
                }`}
              />
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.unlimitedSeats}
                  onChange={handleUnlimitedChange}
                  className="text-teal-500 focus:ring-teal-500 h-5 w-5"
                />
                <span className="ml-2 text-gray-600">Unlimited</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => setShowPreview(true)}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            Preview
          </button>
          <button
            onClick={handlePublish}
            disabled={isSubmitting || !formData.title || !formData.examType || !formData.price}
            className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 shadow-sm ${
              isSubmitting || !formData.title || !formData.examType || !formData.price
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800'
            }`}
          >
            Publish Course
          </button>
        </div>
      </div>
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Course Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
              >
                ✕
              </button>
            </div>
            <CoursePreviewTab formData={formData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCourseForm;