import React from "react";

type Props = {
  user?: any
}

export class User extends React.Component<Props> {
  public constructor(props: Props) {
    super(props)
  }

  public render(): React.ReactNode {
    return (
      <pre>
        <code
          key={this.props.user?.id || "0"}
        >
          {
            this.props.user
              ? JSON.stringify(this.props.user, undefined, 4)
              : "You must log in"
          }
        </code>
      </pre>
    )
  }
}