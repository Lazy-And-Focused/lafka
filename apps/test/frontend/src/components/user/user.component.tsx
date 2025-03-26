import React from "react";
import { LAFka } from "@lafka/types";

type Props = {
  user?: LAFka.User
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