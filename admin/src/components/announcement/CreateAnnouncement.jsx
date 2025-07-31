import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';

const CreateAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [audienceType, setAudienceType] = useState('all');
  const [audienceValue, setAudienceValue] = useState('all');
  const [type, setType] = useState('announcement');
  const [channel, setChannel] = useState('in-app');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [errors, setErrors] = useState({});
  const { token } = useAuth();
  const { addNotification } = useContext(NotificationContext);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { role: 'student', status: 'active' },
      });
      setStudents(response.data.users.map(user => ({
        id: user._id,
        name: user.name || 'Unknown',
        phone: user.phone || 'N/A',
        display: `${user.name || 'Unknown'}${user.phone ? ` (${user.phone})` : ''}`,
      })));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.courses.map(course => ({ id: course._id, title: course.title })));
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size must be less than 5MB.' });
        return;
      }
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        setErrors({ ...errors, image: 'Only PNG and JPEG images are allowed.' });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setErrors({ ...errors, image: '' });
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    document.getElementById('image-upload').value = '';
    setErrors({ ...errors, image: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!message.trim()) newErrors.message = 'Message is required';
    if (!type) newErrors.type = 'Type is required';
    if (!audienceType) newErrors.audienceType = 'Audience type is required';
    if (!channel) newErrors.channel = 'Notification channel is required';
    if (audienceType !== 'all' && !audienceValue) newErrors.audienceValue = 'Audience selection is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('message', message);
    if (image) formData.append('image', image);
    formData.append('type', type);
    formData.append('audienceType', audienceType);
    formData.append('recipient', audienceValue);
    formData.append('channel', channel);
    if (channel === 'in-app' && scheduleEnabled && scheduledAt) {
      formData.append('scheduledAt', scheduledAt.toISOString());
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/notification`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      addNotification(response.data.notification);
      toast.success(response.data.message);
      setTitle('');
      setMessage('');
      setImage(null);
      setImagePreview(null);
      setAudienceType('all');
      setAudienceValue('all');
      setType('announcement');
      setChannel('in-app');
      setScheduleEnabled(false);
      setScheduledAt(new Date());
      setSearchTerm('');
      setSelectedStudent(null);
      setErrors({});
      document.getElementById('image-upload').value = '';
    } catch (error) {
      console.error('Error creating notification:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage = error.response?.data?.message || 'Failed to create notification';
      toast.error(errorMessage);
    }
  };

  const filteredStudents = students.filter(student =>
    student.display.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 scrollbar-hidden w-full border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Create Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter announcement title"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              aria-label="Announcement title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-2">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              aria-label="Announcement type"
            >
              <option value="">Select Type</option>
              <option value="announcement">Announcement</option>
              <option value="reminder">Reminder</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-2">{errors.type}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter announcement message"
            rows={6}
            className="w-full h-12 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
            aria-label="Announcement message"
          />
          {errors.message && <p className="text-red-500 text-xs mt-2">{errors.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Image (Optional)</label>
          <input
            id="image-upload"
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleImageChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
            aria-label="Upload announcement image"
          />
          {errors.image && <p className="text-red-500 text-xs mt-2">{errors.image}</p>}
          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview} alt="Preview" className="max-w-xs rounded-md border border-gray-200" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                aria-label="Remove image"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Audience Type</label>
            <select
              value={audienceType}
              onChange={(e) => {
                setAudienceType(e.target.value);
                setAudienceValue(
                  e.target.value === 'all' ? 'all' :
                  e.target.value === 'course' && courses.length > 0 ? courses[0].id :
                  e.target.value === 'student' && students.length > 0 ? students[0].id : ''
                );
                setSearchTerm('');
                setSelectedStudent(null);
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              aria-label="Audience type"
            >
              <option value="all">All Students</option>
              <option value="course">By Course</option>
              <option value="student">Specific Student</option>
            </select>
            {errors.audienceType && <p className="text-red-500 text-xs mt-2">{errors.audienceType}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Audience</label>
            {audienceType === 'student' ? (
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search student..."
                    className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
                    aria-label="Search student"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {searchTerm && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <div
                          key={student.id}
                          onClick={() => {
                            setAudienceValue(student.id);
                            setSelectedStudent(student);
                            setSearchTerm('');
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm transition-all duration-200"
                        >
                          {student.display}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-600 text-sm">No students found</div>
                    )}
                  </div>
                )}
                {selectedStudent && (
                  <p className="text-teal-600 text-sm mt-2 truncate">Selected: {selectedStudent.display}</p>
                )}
                {errors.audienceValue && !selectedStudent && (
                  <p className="text-red-500 text-xs mt-2">{errors.audienceValue}</p>
                )}
              </div>
            ) : (
              <select
                value={audienceValue}
                onChange={(e) => setAudienceValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
                aria-label="Audience selection"
                disabled={audienceType === 'all'}
              >
                {audienceType === 'course' ? (
                  <>
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </>
                ) : (
                  <option value="all">All Students</option>
                )}
              </select>
            )}
            {errors.audienceValue && audienceType !== 'student' && (
              <p className="text-red-500 text-xs mt-2">{errors.audienceValue}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Channel</label>
          <select
            value={channel}
            onChange={(e) => {
              setChannel(e.target.value);
              if (e.target.value === 'email') {
                setScheduleEnabled(false);
                setScheduledAt(new Date());
              }
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
            aria-label="Notification channel"
          >
            <option value="in-app">In-App Notification</option>
            <option value="email">Email</option>
          </select>
          {errors.channel && <p className="text-red-500 text-xs mt-2">{errors.channel}</p>}
        </div>

        {channel === 'in-app' && (
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-semibold text-gray-700">Schedule Announcement</label>
            <input
              type="checkbox"
              checked={scheduleEnabled}
              onChange={(e) => setScheduleEnabled(e.target.checked)}
              className="h-5 w-5 text-teal-600 focus:ring-teal-500 border-gray-200 rounded"
              aria-label="Toggle schedule"
            />
          </div>
        )}

        {channel === 'in-app' && scheduleEnabled && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule Date & Time</label>
            <DatePicker
              selected={scheduledAt}
              onChange={setScheduledAt}
              showTimeSelect
              dateFormat="Pp"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 shadow-sm hover:shadow-md"
              aria-label="Schedule send date and time"
            />
          </div>
        )}

        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="submit"
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            aria-label="Create announcement"
          >
            Create Announcement
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAnnouncement;