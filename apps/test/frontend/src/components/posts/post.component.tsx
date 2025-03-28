import React from "react";

/* eslint-disable */
type Props = {
  userId: string,
  headers: any,
};
/* eslint-enable */
  
export class Post extends React.Component<Props> {
  public constructor(props: Props) {
    super(props);
  }

  private CreatePost() {
    const data = [
      document.getElementById("post_name"),
      document.getElementById("post_content"),
      document.getElementById("post_type")
    ].filter(d => d !== null);

    if (data.length !== 3) return;

    (async () => {
      await fetch("http://localhost:3001/api/posts/", {
        method: "POST", headers: {
          ...this.props.headers,
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          userId: this.props.userId,
          name: (data[0] as any).value || "",
          content: (data[1] as any).value || "",
          type: (data[2] as any).value || "",
        })
      });
    })();
  };

  public render(): React.ReactNode {
    return (
      <div
        key={"write-post"}
        id="write_post"
      >
        <div>
          <span id="post_name_text">Post name:</span>
          <input type="text" id="post_name" required minLength={12} maxLength={128} />
        </div>
        <div>
          <span id="post_content_text">Post content:</span>
          <input type="text" id="post_content" required minLength={24} maxLength={2048} />
        </div>
        <div>
          <span id="post_type_text">Post type:</span>
          <input type="text" id="post_type" required pattern="blog or forum" onInput={(e) => {
            const el = document.getElementById("post_type_text");
            if (!el) return;

            if (!["blog", "forum"].includes(e.currentTarget.innerText.toLocaleLowerCase()))
              el.innerText = "Post type: (must be blog of forum)";
            else el.innerText = "Post type:"
          }} />
        </div>
        <input type="submit" onClick={() => {this.CreatePost()}}/>
      </div>
    )
  }  
}