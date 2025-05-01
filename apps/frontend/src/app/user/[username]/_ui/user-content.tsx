import Image from 'next/image';

export default function UserContent() {
  return (
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
