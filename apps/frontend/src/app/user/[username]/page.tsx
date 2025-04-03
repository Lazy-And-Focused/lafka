import { LAFka } from '@lafka/types';

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
    const res = fetch('https://localhost:3001/api/users/' + username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }).then((data) => data.json());

    const user: LAFka.User = (await res).resource;

    return `${user.id} ${user.nickname} (${user.username})`;
  } catch {
    return 'Произошла ошибка или пользователь не найден';
  }
}
