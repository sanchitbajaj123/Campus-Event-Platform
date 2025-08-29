
import React from 'react';
import { useAppContext } from '../context/AppContext';

const RoleSwitcher: React.FC = () => {
  const { currentUser, users, switchUser } = useAppContext();

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    switchUser(Number(event.target.value));
  };

  return (
    <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-600">Viewing as:</span>
        <select
            value={currentUser.id}
            onChange={handleRoleChange}
            className="block w-full pl-3 pr-8 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
        >
            {users.map(user => (
                <option key={user.id} value={user.id}>
                    {user.name}
                </option>
            ))}
        </select>
    </div>
  );
};

export default RoleSwitcher;
