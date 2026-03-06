import Image from 'next/image';

import React from 'react';

import styles from "./user.module.css";

import { User } from '@lafka/types';

type Props = {
  user?: User;
};

export class UserComponent extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
  }

  public render(): React.ReactNode {
    const { user } = this.props;

    if (!user) return <></>;

    return (
      <div className={styles.user}>
        <div className={styles.user_avatar}>
          <Image src={user.avatar || "/post-cover.png"} alt='user avatar' height={96} width={96} />
          <div className={styles.links}>
            {
              user.links.length !== 0
                ? user.links.map((link) => 
                  <a href={link.url} target='_blank'>
                   {link.name}
                  </a>
                )
                : "Ссылок нет"
            }
          </div>
        </div>

        <div className={styles.user_biography}>
          <span>{user.nickname ?? user.username}</span>
          <p>{user.biography || "Описания нет"}</p>
        </div>
      </div>
    );
  }
}
