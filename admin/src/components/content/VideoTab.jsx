import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const VideoTab = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoURL, setVideoURL] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Courses fetched (Videos):', response.data.courses);
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching courses (Videos):', error);
        toast.error(error.response?.data?.message || 'Failed to fetch courses.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  useEffect(() => {
    const fetchVideos = async () => {
      if (selectedCourse) {
        setIsLoading(true);
        console.log('Fetching videos for course:', selectedCourse._id);
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/video/course/${selectedCourse._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Videos fetched:', response.data.videos);
          setVideos(response.data.videos || []);
        } catch (error) {
          console.error('Error fetching videos:', error);
          if (error.response?.status === 404) {
            console.log('No videos found, setting empty array');
            setVideos([]);
          } else {
            toast.error(error.response?.data?.message || 'Failed to fetch videos.');
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('No course selected, clearing videos');
        setVideos([]);
      }
    };
    fetchVideos();
  }, [selectedCourse, token]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCourseSelect = (course) => {
    console.log('Course selected (Videos):', course);
    setSelectedCourse(course);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const clearCourse = () => {
    console.log('Clearing selected course (Videos)');
    setSelectedCourse(null);
    setSearchQuery('');
  };

  const addVideo = async () => {
    if (!videoTitle || !videoURL || !selectedCourse) {
      toast.error('Please fill all video fields and select a course.');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/video`,
        {
          courseId: selectedCourse._id,
          title: videoTitle,
          link: videoURL,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Video added:', response.data.video);
      setVideos((prev) => [...prev, response.data.video]);
      setVideoTitle('');
      setVideoURL('');
      toast.success('Video added successfully!');
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error(error.response?.data?.message || 'Failed to add video.');
    }
  };

  const removeVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to remove this video?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/video/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Video removed:', videoId);
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
      toast.success('Video removed successfully!');
    } catch (error) {
      console.error('Error removing video:', error);
      toast.error(error.response?.data?.message || 'Failed to remove video.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="block text-gray-600 font-medium mb-2">Select Course</label>
        <div className="relative">
          <input
            type="text"
            value={selectedCourse ? selectedCourse.title : searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
              if (selectedCourse) setSelectedCourse(null);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search for a course..."
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
            disabled={isLoading || courses.length === 0}
          />
          {selectedCourse && (
            <button
              onClick={clearCourse}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
          {isDropdownOpen && searchQuery.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <button
                    key={course._id}
                    onClick={() => handleCourseSelect(course)}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {course.title} ({course.examType})
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No courses found</div>
              )}
            </div>
          )}
        </div>
        {courses.length === 0 && !isLoading && (
          <p className="mt-2 text-sm text-gray-500">No courses available. Please create a course first.</p>
        )}
        {isLoading && <p className="mt-2 text-sm text-gray-500">Loading courses...</p>}
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Video</h3>
        <input
          type="text"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          placeholder="Lecture title"
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={isLoading}
        />
        <input
          type="text"
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
          placeholder="YouTube URL"
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={isLoading}
        />
        <button
          onClick={addVideo}
          disabled={isLoading || !selectedCourse || !videoTitle || !videoURL}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-3 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-colors duration-300 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Video'}
        </button>
      </div>
      {selectedCourse && (
        videos.length > 0 ? (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-teal-50">
                <tr>
                  <th className="px-6 py-4 text-center text-base font-semibold text-teal-800">Course</th>
                  <th className="px-6 py-4 text-center text-base font-semibold text-teal-800">Title</th>
                  <th className="px-6 py-4 text-center text-base font-semibold text-teal-800">URL</th>
                  <th className="px-6 py-4 text-center text-base font-semibold text-teal-800 w-32">Action</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video._id} className="hover:bg-gray-100 transition-colors border-b border-gray-100">
                    <td className="px-6 py-4 text-center text-gray-800">{selectedCourse?.title}</td>
                    <td className="px-6 py-4 text-center text-gray-800">{video.title}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="group relative">
                        <a
                          href={video.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:underline truncate max-w-xs inline-block"
                        >
                          {video.link}
                        </a>
                        <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 -mt-8 left-1/2 transform -translate-x-1/2">
                          {video.link}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => removeVideo(video._id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors text-sm font-semibold"
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center text-lg">No videos available for this course.</p>
        )
      )}
    </div>
  );
};

export default VideoTab;