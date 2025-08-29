import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

const Logo = () => (
    <div className="flex items-center space-x-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-neutral-900">CampusEvents</span>
    </div>
);


const Header: React.FC = () => {
    const { currentUser, logout } = useAppContext();
    const navigate = useNavigate();

    if (!currentUser) return null;

    const isPrivilegedUser = currentUser.role === UserRole.ORGANIZER || currentUser.role === UserRole.ADMIN;

    const linkStyle = "relative px-3 py-2 rounded-md text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300";
    const activeLinkStyle = "text-primary font-semibold after:w-1/2 bg-primary/10";
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white/80 backdrop-blur-lg border-b border-neutral-200 sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <NavLink to="/">
                            <Logo />
                        </NavLink>
                        <div className="hidden md:flex items-baseline space-x-4">
                            <NavLink to="/" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}>
                                Events
                            </NavLink>
                            {isPrivilegedUser && (
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${linkStyle} ${activeLinkStyle}` : linkStyle}>
                                    Dashboard
                                </NavLink>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                       <div className="text-sm text-right hidden sm:block">
                           <p className="font-medium text-neutral-800">{currentUser.name.split(' ')[0]}</p>
                           <p className="text-xs text-neutral-500">{currentUser.role}</p>
                       </div>
                       <button
                         onClick={handleLogout}
                         title="Logout"
                         className="flex items-center justify-center h-10 w-10 rounded-full text-neutral-500 bg-neutral-100 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                       >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                           </svg>
                       </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;