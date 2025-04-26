import defaultUserAvatar from '@/utils/defaultUserAvatar';
import Image from 'next/image';

// Скрыл, пока верстал

// export default async function User({
//   params,
// }: {
//   params: Promise<{ username: string }>;
// }) {
//   const username = (await params).username;
//   let isValidParams = false;

//   // '%40' == '@' (not '===' !)
//   if (username.startsWith('%40') || !isNaN(Number(username)))
//     isValidParams = true;

//   if (!isValidParams) return 'Неверно сформулированный запрос';

//   try {
//     let user: LAFka.User;

//     if (
//       process.env.NODE_ENV === 'development' &&
//       !!process.env.ENABLE_TEST_USER
//     )
//       user = DefaultUser;
//     else {
//       const res = fetch(
//         process.env.NEXT_PUBLIC_BACKEND_API + '/users/' + username,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json;charset=utf-8',
//           },
//           cache: 'no-cache',
//           next: { revalidate: 3_600 /* 1 hour */ },
//         },
//       ).then((data) => data.json());

//       user = (await res).resource;
//     }

//     return (
//       <div className='section-block flex max-w-min flex-col items-center'>
//         <Image
//           src={user.avatar ?? defaultUserAvatar}
//           alt={`${user.username}'s avatar`}
//           className='min-w-64 rounded-md'
//           width={256}
//           height={256}
//         />
//         <h2 className='text-center text-3xl font-normal'>
//           {user.nickname || user.username}
//         </h2>

//         <ul>
//           {user.links.map((l, i) => (
//             <li key={l.name + '-' + i}>
//               <a href={l.link} target='_blank'>
//                 {l.name}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   } catch {
//     return 'Произошла ошибка или пользователь не найден';
//   }
// }

export default function User() {
  return (
    <div className='grid w-full grid-cols-3 gap-6'>
      <div className='section-block flex max-w-min flex-col items-center'>
        <Image
          src={defaultUserAvatar}
          alt={`user's avatar`}
          className='min-w-[9.5rem] rounded-md'
          width={150}
          height={150}
        />
        <h2 className='text-center font-[Prata] text-2xl font-normal'>
          aculaOne
        </h2>

        <ul className='flex w-full flex-col'>
          {[
            { name: 'tesst', link: 'https://example.com/' },
            { name: 'tesst2', link: 'https://example.org/' },
          ].map((l, i) => (
            <li key={l.name + '-' + i} className='mb-2 flex max-h-max w-full'>
              <a
                href={l.link}
                target='_blank'
                className='inline-flex w-full items-center justify-start gap-2 rounded-lg border border-[#EFDBB3]'
              >
                <span className='flex h-6 w-6 items-center justify-center border-r border-r-[#EFDBB3] p-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width={16}
                    height={16}
                    viewBox='0 0 24 24'
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
                </span>

                <span className='my-1'>{l.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className='section-block col-span-2 grid grid-cols-2'>
        <div className='post flex-col'>
          <div className='cover aspect-[350_/_120] w-full'>
            <Image src='/post-cover.png' alt='Обложка поста' fill />

            <p className='author -bottom-full top-[5px]'>Блог</p>
          </div>

          <div className='body'>
            <p className='title' role='heading' aria-level={2}>
              Пример поста
            </p>
            <p className='short'>
              Мы вынуждены отталкиваться от того, что убеждённость некоторых
              оппонентов прекрасно подходит для реализации соответствующих
              условий активизации. Равным образом, сложившаяся структура
              организации играет важную роль в формировании модели развития.
              Внезапно, явные признаки победы институционализации неоднозначны и
              будут заблокированы в рамках своих собственных рациональных
              ограничений.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
