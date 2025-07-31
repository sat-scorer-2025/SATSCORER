import React from 'react';

const ProfileAvatar = ({ src, alt, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 ring-4 ring-teal-200 shadow-lg relative`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <svg className="w-1/2 h-1/2 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-6 2.67-6 6v2h12v-2c0-3.33-2.67-6-6-6z" />
        </svg>
      )}
    </div>
  );
};

export default ProfileAvatar;
