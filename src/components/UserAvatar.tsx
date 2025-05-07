import React from 'react';

interface UserAvatarProps {
  name: string;
  size?: number;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}

const colors = [
  '#4f46e5', '#06b6d4', '#f59e42', '#f43f5e', '#06d6a0', '#ffd166', '#6366f1', '#3f5efb', '#43cea2', '#185a9d'
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, size = 40 }) => {
  const initials = getInitials(name);
  const bgColor = getColor(name);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bgColor,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size * 0.48,
        boxShadow: '0 2px 8px rgba(79,70,229,0.11)',
        border: '2px solid #fff',
        userSelect: 'none',
      }}
      title={name}
    >
      {initials}
    </div>
  );
};

export default UserAvatar; 