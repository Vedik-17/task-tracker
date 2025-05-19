import React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'high' | 'medium' | 'low';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'badge',
          `badge-${variant}`,
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;