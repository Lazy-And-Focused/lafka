import Image from 'next/image';

import MessageUser from './icons/MessageUser';

export default async function Home() {
  return (
    <div className='section-block grid grid-cols-2'>
      <div className='post'>
        <div className='cover'>
          <Image src='/post-cover.png' alt='Обложка поста' fill />

          <p className='author'>
            <MessageUser width={12} height={12} />
            lanvalird
          </p>
        </div>

        <div className='body'>
          <p className='title' role='heading' aria-level={2}>
            Пример поста
          </p>
          <p className='short'>
            Мы вынуждены отталкиваться от того, что убеждённость некоторых
            оппонентов прекрасно подходит для реализации соответствующих условий
            активизации. Равным образом, сложившаяся структура организации
            играет важную роль в формировании модели развития. Внезапно, явные
            признаки победы институционализации неоднозначны и будут
            заблокированы в рамках своих собственных рациональных ограничений.
          </p>
        </div>
      </div>
    </div>
  );
}
