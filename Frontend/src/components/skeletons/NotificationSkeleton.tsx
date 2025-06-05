export const NotificationSkeleton = () => {
  return (
    <div className='w-full animate-pulse border-b border-white/20'>
      <div className='flex gap-2 px-4 py-5'>
        <div className='bg-zinc-700 w-8 h-8 rounded-full shrink-0'></div>
        <div className='space-y-2'>
          <div className='bg-zinc-700 w-8 h-8 rounded-full shrink-0'></div>
          <div className='flex gap-1'>
            <div className='bg-zinc-700 h-2 w-24 rounded-full'></div>
          </div>
        </div>
      </div>
    </div>
  );
};
