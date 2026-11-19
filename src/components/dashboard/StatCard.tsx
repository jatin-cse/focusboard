import { type LucideIcon } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  colorClass = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
}: StatCardProps) {
  return (
    <Card className="border-gray-800 bg-gray-900/60 transition-transform duration-200 hover:-translate-y-0.5">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-400 tracking-wider uppercase">{title}</p>
          <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
          {trend && (
            <p
              className={`text-xs font-medium pt-1 ${
                trendUp ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
