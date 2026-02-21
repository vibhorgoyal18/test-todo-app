import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export default function StatsCard({ label, value, icon: Icon, color, testid }) {
  return (
    <Card
      data-testid={testid}
      className={cn(
        'transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5',
        'opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]'
      )}
    >
      <CardContent className="flex items-center gap-4 p-6">
        <div className={cn('rounded-full p-3', color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
