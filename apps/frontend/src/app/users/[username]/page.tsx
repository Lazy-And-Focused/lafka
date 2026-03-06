import { getUser } from '@/shared/user';
import { UserContent, UserInformation } from './_ui';

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    return 'Пользователь не найден';
  }

  return (
    <div className='grid w-full grid-cols-12 gap-6'>
      {/* Их надо будет обернуть в Context */}
      <UserInformation user={user} />
      <UserContent />
    </div>
  );
}
