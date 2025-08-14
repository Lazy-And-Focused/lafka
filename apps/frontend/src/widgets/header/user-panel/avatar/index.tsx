import Image from 'next/image';

interface UserProps {
  avatar?: string;
  username: string;
}

export default function Avatar({ user }: { user: UserProps }) {
  return (
    <Image
      className='aspect-square h-8 w-8 rounded-full'
      src={user.avatar || '/avatar.webp'}
      alt={`${user.username}'s avatar`}
      width='32'
      height='32'
    />
  );
}
