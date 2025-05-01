import type { SVGProps } from 'react';
import type { LAFka } from '@lafka/types';

import Image from 'next/image';

export default function UserInformation({ user }: { user: LAFka.User }) {
  const name = user.nickname || user.username;

  return (
    <div className='section-block flex max-w-min flex-col items-center'>
      <Avatar name={name} src={user.avatar} />
      <Title name={name} />

      <ul className='flex w-full flex-col'>
        {user.links.map((l, i) => (
          <li key={l.name + '-' + i} className='mb-2 flex max-h-max w-full'>
            <a
              href={l.link}
              target='_blank'
              className='inline-flex w-full items-center justify-start gap-2 rounded-lg border border-[#EFDBB3]'
            >
              <span className='flex h-6 w-6 items-center justify-center border-r border-r-[#EFDBB3] p-2'>
                <LinkIcon />
              </span>

              <span className='my-1'>{l.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  return (
    <Image
      src={src || '/avatar.webp'}
      alt={`${name}'s avatar`}
      className='min-w-[9.5rem] rounded-md'
      width={150}
      height={150}
    />
  );
}

function Title({ name }: { name: string }) {
  return (
    <h2
      className='text-center font-[Prata] text-2xl font-normal'
      children={name}
    />
  );
}

function LinkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={16}
      height={16}
      viewBox='0 0 24 24'
      {...props}
    >
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='m9 15l6-6m-4-3l.463-.536a5 5 0 0 1 7.071 7.072L18 13m-5 5l-.397.534a5.07 5.07 0 0 1-7.127 0a4.97 4.97 0 0 1 0-7.071L6 11'
      ></path>
    </svg>
  );
}
