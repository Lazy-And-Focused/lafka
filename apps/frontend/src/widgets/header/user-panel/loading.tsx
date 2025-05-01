import Image from 'next/image';
import defaultUserAvatar from '@/shared/value/defaultUserAvatar';

export default function Loading() {
  return (
    <div
      className={'flex animate-pulse flex-row items-center justify-end gap-5'}
    >
      <Image
        className='aspect-square h-8 w-8 rounded-full'
        src={defaultUserAvatar}
        alt={'Loading avatar'}
        width='32'
        height='32'
      />
      Inkognito (Logging...)
    </div>
  );
}
