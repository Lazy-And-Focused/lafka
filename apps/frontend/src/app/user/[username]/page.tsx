import DefaultUser from '@/utils/_test/DefaultUser';
import defaultUserAvatar from '@/utils/defaultUserAvatar';
import { LAFka } from '@lafka/types';
import Image from 'next/image';

export default async function User({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;
  let isValidParams = false;

  // '%40' == '@' (not '===' !)
  if (username.startsWith('%40') || !isNaN(Number(username)))
    isValidParams = true;

  if (!isValidParams) return 'Неверно сформулированный запрос';

  try {
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.ENABLE_TEST_USER
    ) {
      const user: LAFka.User = DefaultUser;
      return `${user.id} ${user.nickname} (${user.username})`;
    }

    const res = fetch(
      process.env.NEXT_PUBLIC_BACKEND_API + '/users/' + username,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        cache: 'no-cache',
        next: { revalidate: 3_600 /* 1 hour */ },
      },
    ).then((data) => data.json());

    const user: LAFka.User = (await res).resource;

    return (
      <div className='section-block flex flex-col'>
        <Image
          src={user.avatar ?? defaultUserAvatar}
          alt={`${user.username}'s avatar`}
          width={256}
          height={256}
        />
      </div>
    );
  } catch {
    return 'Произошла ошибка или пользователь не найден';
  }
}
