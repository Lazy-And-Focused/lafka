import type { User } from '@lafka/types';

import FilePencil from '@/icons/file-pencil';
import Link from 'next/link';
import Avatar from './avatar';

export default function DisplayUser({ user }: { user: User }) {
  return (
    <div className='flex flex-row items-center justify-center'>
      <EditButton />

      <Link
        href={`/user/@${user.username}`}
        className='inline-flex flex-row items-center justify-end gap-5'
      >
        <Avatar user={user} />

        {user.nickname || user.username}
      </Link>
    </div>
  );
}

function EditButton() {
  return (
    <button className='mr-5 inline-flex h-6 w-6 items-center justify-center rounded-lg border border-[#EFDBB3] text-[#EFDBB3]'>
      <FilePencil width={16} height={16} />
    </button>
  );
}
