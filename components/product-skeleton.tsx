export function ProductSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-800 aspect-[3/4] rounded-md mb-3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2 w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded mb-2 w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        </div>
      ))}
    </div>
  )
}

