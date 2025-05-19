import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, CheckSquare } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import Button from '../ui/Button';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') {
      return 'Dashboard';
    } else if (path.startsWith('/tasks')) {
      return 'Tasks';
    } else if (path.startsWith('/projects')) {
      return 'Projects';
    } else if (path.startsWith('/settings')) {
      return 'Settings';
    } else {
      return 'Task Tracker Pro';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          >
            {isSidebarOpen ? (
              <X size={24} className="animate-fade-in" />
            ) : (
              <Menu size={24} className="animate-fade-in" />
            )}
          </button>
          
          <Link to="/" className="flex items-center">
            <CheckSquare size={24} className="text-primary-500 mr-2" />
            <span className="hidden sm:inline-block text-xl font-bold text-gray-900 dark:text-white">
              Task Tracker Pro
            </span>
          </Link>
          
          <div className="ml-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
            {getPageTitle()}
          </div>
        </div>
        
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={toggleTheme}
            leftIcon={theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;