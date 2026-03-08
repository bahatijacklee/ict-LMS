import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TrendDirection = 'up' | 'down' | 'neutral';

interface TrendIndicatorProps {
  direction: TrendDirection;
  percentage?: number;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 14,
  md: 16,
  lg: 20,
};

/**
 * Displays trend direction with optional percentage
 * Used to show positive/negative changes in metrics
 *
 * @example
 * <TrendIndicator direction="up" percentage={5} />
 * <TrendIndicator direction="down" percentage={2} size="lg" />
 */
export const TrendIndicator = ({
  direction,
  percentage,
  className,
  showIcon = true,
  size = 'md',
}: TrendIndicatorProps) => {
  if (direction === 'neutral') {
    return null;
  }

  const isPositive = direction === 'up';
  const Icon = isPositive ? ArrowUp : ArrowDown;
  const colorClass = isPositive ? 'text-success' : 'text-error';
  const iconSize = sizeMap[size];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-xs font-semibold',
        colorClass,
        className
      )}
    >
      {showIcon && <Icon size={iconSize} />}
      {percentage !== undefined && <span>{percentage}%</span>}
    </div>
  );
};
