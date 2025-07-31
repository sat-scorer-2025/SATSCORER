import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ActiveLiveSessions = () => {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveSessions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/livesession`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter and sort sessions (live or upcoming)
        const now = new Date();
        const filteredSessions = response.data.sessions
          .map(session => ({
            id: session._id,
            title: session.title,
            instructor: session.instructor || 'Unknown',
            time: new Date(session.startTime),
            status: new Date(session.startTime) <= now && new Date(session.endTime) >= now ? 'live' : 'upcoming',
          }))
          .filter(session => session.status === 'live' || new Date(session.time) > now)
          .sort((a, b) => a.time - b.time)
          .slice(0, 5); // Get top 5 sessions

        setSessions(filteredSessions);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch live sessions');
        console.error('Error fetching sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLiveSessions();
    }
  }, [token]);

  if (loading) {
    return <div className="p-4">Loading sessions...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-sm border border-gray-300">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Live Sessions</h2>
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-gray-600">No active or upcoming sessions</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-2 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div>
                <Link to={`/live?id=${session.id}`} className="text-blue-500 hover:underline">
                  {session.title}
                </Link>
                <p className="text-sm text-gray-600">{session.instructor}</p>
                <p className="text-sm text-gray-600">
                  {session.time.toLocaleString()}
                </p>
              </div>
              <div>
                {session.status === 'live' ? (
                  <a
                    href={`/live/join/${session.id}`}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Join
                  </a>
                ) : (
                  <Link
                    to={`/live?id=${session.id}`}
                    className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                  >
                    View
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <Link to="/live/manage" className="text-blue-500 hover:underline mt-4 block">
        View All
      </Link>
    </div>
  );
};

export default ActiveLiveSessions;
