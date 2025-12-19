import React from 'react';
import { Image } from 'react-bootstrap';
import { getInitials } from '../../utils/formatters';

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  firstName,
  lastName,
  profileImageUrl,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { width: 32, height: 32, fontSize: '12px' },
    md: { width: 40, height: 40, fontSize: '14px' },
    lg: { width: 56, height: 56, fontSize: '18px' },
    xl: { width: 80, height: 80, fontSize: '24px' },
  };

  const dimensions = sizeMap[size];

  if (profileImageUrl) {
    return (
      <Image
        src={profileImageUrl}
        roundedCircle
        width={dimensions.width}
        height={dimensions.height}
        className={`object-fit-cover ${className}`}
        alt={`${firstName} ${lastName}`}
      />
    );
  }

  return (
    <div
      className={`rounded-circle d-flex align-items-center justify-content-center ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: '#3b82f6',
        color: 'white',
        fontWeight: 'bold',
        fontSize: dimensions.fontSize,
      }}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
};

export default UserAvatar;