import type { LAFka } from '@lafka/types';

import FilePencil from '@/app/_icons/FilePencil';
import Image from 'next/image';
import Link from 'next/link';

export default function DisplayUser({ user }: { user: LAFka.User }) {
  return (
    <div className='flex flex-row items-center justify-center'>
      <button className='mr-5 inline-flex h-6 w-6 items-center justify-center rounded-lg border border-[#EFDBB3] text-[#EFDBB3]'>
        <FilePencil width={16} height={16} />
      </button>

      <Link
        href={`/user/@${user.username}`}
        className='inline-flex flex-row items-center justify-end gap-5'
      >
        <Image
          className='aspect-square h-8 w-8 rounded-full'
          src={
            user.avatar ||
            'https://laf-info.netlify.app/images/avatars/default.png'
          }
          alt={`${user.username}'s avatar`}
          width='32'
          height='32'
        />
        {user.nickname || user.username}
      </Link>
    </div>
  );
}
