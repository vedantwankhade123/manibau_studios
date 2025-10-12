import React from 'react';
import { Pencil } from 'lucide-react';

interface UserProfileCardProps {
  name: string;
  email: string;
  isEditing: boolean;
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onToggleEdit: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  email,
  isEditing,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onToggleEdit,
}) => {
  return (
    <div className="relative p-4 border border-zinc-200 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-2xl">
      <div className="flex-grow">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="First Name"
              className="w-full bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 text-zinc-800 dark:text-white rounded-lg p-1.5 text-lg font-bold focus:ring-gray-500 focus:border-gray-500"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder="Last Name"
              className="w-full bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 text-zinc-800 dark:text-white rounded-lg p-1.5 text-lg font-bold focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
        ) : (
          <h4 className="text-lg font-bold text-zinc-800 dark:text-white">{name}</h4>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
      </div>
      {!isEditing && (
        <button
          onClick={onToggleEdit}
          className="absolute top-3 right-3 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          aria-label="Edit profile"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default UserProfileCard;