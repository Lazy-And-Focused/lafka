import Image from 'next/image';
import React from 'react';

import styles from "./posts.module.css";

import { LazyPost } from '@lafka/types';

type Props = {
  posts?: LazyPost[] | undefined;
  headers?: any;
};

export class Posts extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
  }

  public post(post: LazyPost) {
    return (
      <div  className={styles.post} id={post.id}>
        <div className={styles.cover}>
          <Image alt={`post ${post.name}'s cover`} src={"/post-cover.png"} height={112} width={200} />
          <span>{post.creator_id}</span>
        </div>

        <div className={styles.content}>
          <h6>{post.name}</h6>
          <p>{post.content}</p>
        </div>
      </div>
    );
  }

  public render(): React.ReactNode {
    if (!this.props.posts) return <></>;

    return (
      <>
        {this.props.posts.map((post) => this.post(post))}
      </>
    );
  }
}
