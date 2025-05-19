import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderKanban, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen, onClose }) => {
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Tasks',
      path: '/tasks',
      icon: <CheckSquare size={20} />,
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: <FolderKanban size={20} />,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings size={20} />,
    },
  ];
  
  if (isMobile && !isOpen) {
    return null;
  }
  
  return (
    <aside
      className={cn(
        'z-20 flex flex-col fixed inset-y-0 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-6 w-64 transition-transform duration-300 ease-in-out',
        {
          '-translate-x-full': isMobile && !isOpen,
          'translate-x-0': !isMobile || isOpen,
        }
      )}
    >
      <div className="overflow-y-auto overflow-x-hidden flex-grow">
        <ul className="flex flex-col py-4 space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                onClick={() => isMobile && onClose()}
                className={({ isActive }) =>
                  cn(
                    'relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border-l-4 border-transparent font-medium',
                    {
                      'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500 text-primary-700 dark:text-primary-300': isActive,
                    }
                  )
                }
              >
                <span className="inline-flex justify-center items-center ml-4">
                  {item.icon}
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
          <span className="tracking-wide">
            Task Tracker Pro &copy; 2025
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;