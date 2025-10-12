
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, children, ...props }) => {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        {label}
      </label>
      <select
        {...props}
        className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-zinc-800 dark:text-white rounded-lg p-2.5 focus:ring-gray-500 focus:border-gray-500"
      >
        {children}
      </select>
    </div>
  );
};

export default Select;