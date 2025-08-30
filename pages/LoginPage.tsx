import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Logo = () => (
    <div className="flex items-center space-x-2.5">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <span className="text-2xl font-bold tracking-tight text-neutral-900">CampusEvents</span>
    </div>
);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password. Please try again.');
      } else {
        // Get the user from local context after login
        const user = JSON.parse(localStorage.getItem('lastLoggedInUser') || 'null');
        // If not found in localStorage, fallback to context (for SSR or strict mode)
        if (user && (user.role === 'ADMIN' || user.role === 'ORGANIZER')) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <Logo />
        <h2 className="mt-6 text-3xl font-extrabold text-neutral-900">
          Sign in to your account
        </h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        </div>
        
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Sign in
          </button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-sm text-neutral-600">
          New student?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;