import type { User } from '@lafka/types';

/**
 * Test object by User type
 */
const DefaultUser: User = {
  id: '0',
  username: 'test_cool_userIUS',
  nickname: 'Mr Testy UsKra',
  avatar: '/post-cover.png',
  biography: "Hi! I'm tweek",
  blocked_posts: [],
  blog_posts: [],
  created_at: new Date().toISOString(),
  followed_blog_posts: [],
  followed_forum_posts: [],
  followers: [],
  forum_posts: [],
  following: [],
  links: [
    { name: '1test', url: 'http://localhost:3000/' },
    { name: '2test', url: 'http://localhost:3001/' },
  ],
  rights: '',
};

export default DefaultUser;
