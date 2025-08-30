import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }


  // Accept both enum and string role values for backend compatibility
  const allowedRoleStrings = allowedRoles.map(r =>
    typeof r === 'string' ? r :
    r === 'ADMIN' || r === 'Admin' ? 'ADMIN' :
    r === 'ORGANIZER' || r === 'Organizer' ? 'ORGANIZER' :
    r === 'STUDENT' || r === 'Student' ? 'STUDENT' : r
  );
  const userRole = (currentUser.role || '').toUpperCase();
  if (!allowedRoleStrings.map(r => r.toUpperCase()).includes(userRole)) {
    return (
        <div className="text-center p-10 bg-white border border-yellow-300/50 shadow-sm rounded-xl">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-neutral-800">Access Denied</h2>
            <p className="mt-2 text-neutral-600">You do not have the necessary permissions to view this page. <br/> This area is restricted to {allowedRoles.join('s & ')}s.</p>
        </div>
    );
  }

  return children;
};

export default ProtectedRoute;