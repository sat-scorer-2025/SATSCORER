import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ProfileEditDialog from '../components/profile/ProfileEditDialog';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import { UserIcon } from '../components/profile/Icons';

const Profile = () => {
  const { user, token } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    profilePhoto: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        profilePhoto: user.profilePhoto || '',
      });
    }
  }, [user]);

  const handleEditOpen = () => setIsEditOpen(true);
  const handleEditClose = () => setIsEditOpen(false);

  return (
    <div className="w-full h-full bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-teal-800">
              Profile
            </h1>
            <button
              onClick={handleEditOpen}
              className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>
          </div>
          <div className="flex items-center mb-8">
            <ProfileAvatar src={profileData.profilePhoto} alt={profileData.name} size="large" />
            <div className="ml-6">
              <h2 className="text-2xl font-semibold text-gray-900">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start bg-gray-50 p-4 rounded-lg shadow-sm">
              <UserIcon className="w-6 h-6 text-teal-600 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-gray-900 font-medium">{profileData.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-start bg-gray-50 p-4 rounded-lg shadow-sm">
              <UserIcon className="w-6 h-6 text-teal-600 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700">Address</p>
                <p className="text-gray-900 font-medium">{profileData.address || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-start bg-gray-50 p-4 rounded-lg shadow-sm">
              <UserIcon className="w-6 h-6 text-teal-600 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                <p className="text-gray-900 font-medium">{profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditOpen && (
        <ProfileEditDialog
          isOpen={isEditOpen}
          onClose={handleEditClose}
          profileData={profileData}
          setProfileData={setProfileData}
          token={token}
        />
      )}
    </div>
  );
};

export default Profile;

