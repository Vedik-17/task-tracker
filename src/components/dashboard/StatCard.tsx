import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("transition-all duration-300 hover:transform hover:scale-[1.02]", className)}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            {description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {description}
              </p>
            )}
            {trend && (
              <div className="mt-2 flex items-center">
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    {
                      "text-success-800 bg-success-100 dark:text-success-100 dark:bg-success-800":
                        trend.direction === "up",
                      "text-error-800 bg-error-100 dark:text-error-100 dark:bg-error-800":
                        trend.direction === "down",
                      "text-gray-800 bg-gray-100 dark:text-gray-100 dark:bg-gray-800":
                        trend.direction === "neutral",
                    }
                  )}
                >
                  {trend.direction === "up" && (
                    <svg
                      className="-ml-0.5 mr-1 h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  )}
                  {trend.direction === "down" && (
                    <svg
                      className="-ml-0.5 mr-1 h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                  {trend.value}
                </span>
              </div>
            )}
          </div>
          {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;