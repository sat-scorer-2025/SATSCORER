import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProfileAvatar from './ProfileAvatar';
import { UserIcon, LockIcon, EmailIcon, CameraIcon } from './Icons';

const ProfileEditDialog = ({ isOpen, onClose, profileData, setProfileData, token }) => {
  const [formData, setFormData] = useState({
    ...profileData,
    password: '',
    confirmPassword: '',
    profilePhotoFile: null,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePhotoFile: file,
      profilePhoto: file ? URL.createObjectURL(file) : formData.profilePhoto,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('email', formData.email);
      updateData.append('phone', formData.phone);
      updateData.append('address', formData.address);
      updateData.append('dateOfBirth', formData.dateOfBirth);
      if (formData.password) updateData.append('password', formData.password);
      if (formData.profilePhotoFile) updateData.append('profilePhoto', formData.profilePhotoFile);

      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.message === 'Profile updated successfully') {
        setProfileData({
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          address: response.data.user.address,
          dateOfBirth: response.data.user.dateOfBirth ? new Date(response.data.user.dateOfBirth).toISOString().split('T')[0] : '',
          profilePhoto: response.data.user.profilePhoto,
        });
        toast.success('Profile updated successfully!');
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Server error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl ring-2 ring-teal-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-teal-800">
            Edit Profile
          </h2>
          <button onClick={onClose} className="text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <ProfileAvatar src={formData.profilePhoto} alt={formData.name} size="large" />
              <label htmlFor="profilePhoto" className="absolute bottom-0 right-0 bg-teal-600 text-white rounded-full p-2 cursor-pointer shadow-md">
                <CameraIcon className="w-5 h-5" />
                <input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <UserIcon className="w-5 h-5 mr-2" /> Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg outline-none bg-gray-50 ${errors.name ? 'border-red-500' : 'border-teal-300'}`}
              type="text"
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <EmailIcon className="w-5 h-5 mr-2" /> Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg outline-none bg-gray-50 ${errors.email ? 'border-red-500' : 'border-teal-300'}`}
              type="email"
              placeholder="Your Email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <UserIcon className="w-5 h-5 mr-2" /> Phone
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg outline-none bg-gray-50 border-teal-300"
              type="tel"
              placeholder="Phone Number"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <UserIcon className="w-5 h-5 mr-2" /> Address
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg outline-none bg-gray-50 border-teal-300"
              type="text"
              placeholder="Address"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <UserIcon className="w-5 h-5 mr-2" /> Date of Birth
            </label>
            <input
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg outline-none bg-gray-50 border-teal-300"
              type="date"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <LockIcon className="w-5 h-5 mr-2" /> Password
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg outline-none bg-gray-50 ${errors.password ? 'border-red-500' : 'border-teal-300'}`}
              type="password"
              placeholder="New Password (leave blank to keep current)"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <LockIcon className="w-5 h-5 mr-2" /> Confirm Password
            </label>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg outline-none bg-gray-50 ${errors.confirmPassword ? 'border-red-500' : 'border-teal-300'}`}
              type="password"
              placeholder="Confirm New Password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditDialog;