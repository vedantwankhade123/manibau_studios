import React, { useRef } from 'react';
import { User, Pencil, Upload } from 'lucide-react';

interface UserProfileCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  isEditing: boolean;
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onAvatarChange: (file: File) => void;
  onToggleEdit: () => void;
  newAvatarPreview?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  email,
  avatarUrl,
  isEditing,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onAvatarChange,
  onToggleEdit,
  newAvatarPreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAvatarChange(e.target.files[0]);
    }
  };

  return (
    <div className="relative p-4 border border-zinc-200 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-2xl flex items-center gap-4">
      <div
        className={`relative w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0 overflow-hidden group ${isEditing ? 'cursor-pointer' : ''}`}
        onClick={handleAvatarClick}
      >
        {newAvatarPreview ? (
          <img src={newAvatarPreview} alt="New avatar preview" className="w-full h-full object-cover" />
        ) : avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <User className="h-8 w-8 text-zinc-500 dark:text-gray-400" />
        )}
        {isEditing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Upload className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
      />
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