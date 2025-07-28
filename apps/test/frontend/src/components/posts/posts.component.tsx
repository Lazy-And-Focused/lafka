import { LazyPost } from "@lafka/types";
import React from "react";

type Props = {
  posts?: LazyPost[] | undefined,
  headers?: any
}

export class Posts extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
  };

  public post(post: LazyPost) {
    return (
      <div id={post.id}>
        <h3>Название: {post.name} <br /> в {`${new Date(post.created_at)}`}</h3>
        <p>Контент: {post.content}</p>
        {
          post.description
            ? <h5>Описание: {post.description}</h5>
            : <h5>Описания нет</h5>
        }
        <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
          <span>Лайки: {post.likes}</span>
          <span>Дизлайки: {post.dislikes}</span>
          <span>Фолловеры: {post.followers}</span>
          <span>Репосты: {post.reposts}</span>
          {post.tags.map(tag => <span>{tag.name}</span>)}
        </div>
        <button onClick={async () => {
          document.getElementById(post.id)?.remove();

          await fetch("http://localhost:3001/api/posts/"+post.id, {
            method: "DELETE",
            headers: this.props.headers
          })
        }}>УДАЛИТЬ ПОСТ</button>

        <hr />
      </div>
    )
  }

  public render(): React.ReactNode {
    if (!this.props.posts) return <></>;
    
    return (
      <div id="posts" style={{height: "70vh", overflow: "auto"}}>
        {
          this.props.posts.map(post => this.post(post))
        }
      </div>
    );
  }
}