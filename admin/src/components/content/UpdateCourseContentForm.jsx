import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UpdateCourseContentForm = ({ course }) => {
  const { token } = useAuth();
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteLink, setNoteLink] = useState('');
  const [editIndex, setEditIndex] = useState({ type: null, id: null });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!course) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/video/course/${course._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
        if (error.response?.status !== 404) {
          toast.error(error.response?.data?.message || 'Failed to fetch videos.');
        }
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchNotes = async () => {
      if (!course) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/notes/course/${course._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes(response.data.notes || []);
      } catch (error) {
        console.error('Error fetching notes:', error);
        if (error.response?.status !== 404) {
          toast.error(error.response?.data?.message || 'Failed to fetch notes.');
        }
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
    fetchNotes();
  }, [course, token]);

  const addVideo = async () => {
    if (!videoTitle || !videoURL || !course) {
      toast.error('Please fill all video fields.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/video`,
        { courseId: course._id, title: videoTitle, link: videoURL },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVideos((prev) => [...prev, response.data.video]);
      setVideoTitle('');
      setVideoURL('');
      toast.success('Video added successfully!');
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error(error.response?.data?.message || 'Failed to add video.');
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async () => {
    if (!noteTitle || !noteLink || !course) {
      toast.error('Please fill all note fields.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notes`,
        { courseId: course._id, title: noteTitle, link: noteLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) => [...prev, response.data.note]);
      setNoteTitle('');
      setNoteLink('');
      toast.success('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(error.response?.data?.message || 'Failed to add note.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (type, id) => {
    setEditIndex({ type, id });
    if (type === 'video') {
      const video = videos.find((v) => v._id === id);
      setVideoTitle(video.title);
      setVideoURL(video.link);
    } else if (type === 'note') {
      const note = notes.find((n) => n._id === id);
      setNoteTitle(note.title);
      setNoteLink(note.link);
    }
  };

  const saveEdit = async () => {
    if (editIndex.type === 'video' && videoTitle && videoURL) {
      setIsLoading(true);
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/video/${editIndex.id}`,
          { title: videoTitle, link: videoURL, courseId: course._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVideos((prev) =>
          prev.map((video) =>
            video._id === editIndex.id ? response.data.video : video
          )
        );
        setVideoTitle('');
        setVideoURL('');
        setEditIndex({ type: null, id: null });
        toast.success('Video updated successfully!');
      } catch (error) {
        console.error('Error updating video:', error);
        toast.error(error.response?.data?.message || 'Failed to update video.');
      } finally {
        setIsLoading(false);
      }
    } else if (editIndex.type === 'note' && noteTitle && noteLink) {
      setIsLoading(true);
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/notes/${editIndex.id}`,
          { title: noteTitle, link: noteLink, courseId: course._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes((prev) =>
          prev.map((note) =>
            note._id === editIndex.id ? response.data.note : note
          )
        );
        setNoteTitle('');
        setNoteLink('');
        setEditIndex({ type: null, id: null });
        toast.success('Note updated successfully!');
      } catch (error) {
        console.error('Error updating note:', error);
        toast.error(error.response?.data?.message || 'Failed to update note.');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Please fill all fields.');
    }
  };

  const removeVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to remove this video?')) return;
    setIsLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/video/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos((prev) => prev.filter((video) => video._id !== videoId));
      toast.success('Video removed successfully!');
    } catch (error) {
      console.error('Error removing video:', error);
      toast.error(error.response?.data?.message || 'Failed to remove video.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to remove this note?')) return;
    setIsLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      toast.success('Note removed successfully!');
    } catch (error) {
      console.error('Error removing note:', error);
      toast.error(error.response?.data?.message || 'Failed to remove note.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Input Fields Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Videos Input */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Add/Edit Video</h3>
          <input
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Lecture title"
            className="border p-2 rounded w-full mb-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={isLoading}
          />
          <input
            value={videoURL}
            onChange={(e) => setVideoURL(e.target.value)}
            placeholder="YouTube URL"
            className="border p-2 rounded w-full mb-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={isLoading}
          />
          <button
            onClick={editIndex.type === 'video' ? saveEdit : addVideo}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded w-full hover:from-teal-600 hover:to-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={isLoading || !videoTitle || !videoURL}
          >
            {isLoading
              ? 'Processing...'
              : editIndex.type === 'video'
              ? 'Save Video'
              : 'Add Video'}
          </button>
        </div>

        {/* Notes Input */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Add/Edit Note (PDF/Drive link)</h3>
          <input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note title"
            className="border p-2 rounded w-full mb-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={isLoading}
          />
          <input
            value={noteLink}
            onChange={(e) => setNoteLink(e.target.value)}
            placeholder="PDF/Drive link"
            className="border p-2 rounded w-full mb-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={isLoading}
          />
          <button
            onClick={editIndex.type === 'note' ? saveEdit : addNote}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded w-full hover:from-teal-600 hover:to-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={isLoading || !noteTitle || !noteLink}
          >
            {isLoading
              ? 'Processing...'
              : editIndex.type === 'note'
              ? 'Save Note'
              : 'Add Note'}
          </button>
        </div>
      </div>

      {/* Tables Section */}
      <div className="space-y-8">
        {/* Videos Table */}
        {videos.length > 0 && (
          <section>
            <h3 className="font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              Videos
            </h3>
            <table className="min-w-full border border-gray-300 rounded shadow-sm">
              <thead className="bg-teal-50">
                <tr>
                  <th className="border px-6 py-4 text-center text-base font-semibold text-teal-800">
                    Title
                  </th>
                  <th className="border px-6 py-4 text-center text-base font-semibold text-teal-800">
                    URL
                  </th>
                  <th className="border px-6 py-4 text-center text-base font-semibold text-teal-800 w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr
                    key={video._id}
                    className="hover:bg-gray-100 transition-colors border-b border-gray-100"
                  >
                    <td className="border px-6 py-4 text-center text-gray-800">
                      {video.title}
                    </td>
                    <td className="border px-6 py-4 text-center">
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
                    <td className="border px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit('video', video._id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold mr-2"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeVideo(video._id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Notes Table */}
        {notes.length > 0 && (
          <section>
            <h3 className="font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              Notes
            </h3>
            <table className="min-w-full border border-gray-300 rounded shadow-sm">
              <thead className="bg-teal-50">
                <tr>
                  <th className="border px-6 py-4 text-center text-base font-semibold text-teal-800">
                    Title
                  </th>
                  <th className="border px-6 py-4 text-center text-base font-semibold text-teal-800">
                    Link
                  </th>
                  <th className="border px-6 py-4 text-center text-base font-semibold text-teal-800 w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr
                    key={note._id}
                    className="hover:bg-gray-100 transition-colors border-b border-gray-100"
                  >
                    <td className="border px-6 py-4 text-center text-gray-800">
                      {note.title}
                    </td>
                    <td className="border px-6 py-4 text-center">
                      <div className="group relative">
                        <a
                          href={note.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:underline truncate max-w-xs inline-block"
                        >
                          {note.link}
                        </a>
                        <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 -mt-8 left-1/2 transform -translate-x-1/2">
                          {note.link}
                        </div>
                      </div>
                    </td>
                    <td className="border px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit('note', note._id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold mr-2"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeNote(note._id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                        disabled={isLoading}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>

      {isLoading && (
        <div className="text-center text-gray-600">Loading...</div>
      )}
      {videos.length === 0 && notes.length === 0 && !isLoading && (
        <p className="text-gray-600 text-center text-lg">
          No content available for this course.
        </p>
      )}
    </div>
  );
};

export default UpdateCourseContentForm;