import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Page not found</p>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Button 
          variant="primary"
          size="lg"
          leftIcon={<Home size={18} />}
          onClick={() => window.location.href = '/'}
        >
          Go to Dashboard
        </Button>
        
        <Button
          variant="secondary"
          size="lg"
          leftIcon={<ArrowLeft size={18} />}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;