import Avatar from './avatar';

export default function Loading() {
  return (
    <div
      className={'flex animate-pulse flex-row items-center justify-end gap-5'}
    >
      <Avatar user={{ avatar: '', username: 'inkognito' }} />
      Inkognito (Logging...)
    </div>
  );
}
