import React, { Component } from "react";

// This defines the data types used in the state of the component

interface ProductivityState {
  availableUsers: string | null;
  dataFetched: boolean;
}

class Productivity extends Component<any, ProductivityState> {
  public state: ProductivityState = {
    availableUsers: null,
    dataFetched: false,
  };

  /* This fetches available users, and transforms it so that array of objects with a user key is an array of strings
  with the user. This is then transformed into a string using the join function, and inputed int the state*/

  async componentDidMount() {
    let res = await fetch("/api/availableUsers", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await res.json();

    if (jsonResponse.users) {
      const availableUsers = jsonResponse.users.map(
        (obj: { name: string }) => obj.name
      );
      this.setState({
        availableUsers: availableUsers.join(", "),
        dataFetched: true,
      });
    }
  }

  render() {
    if (this.state.dataFetched) {
      return (
        <div>
          <p>
            These are the available users that are not currently in a open work
            order: {this.state.availableUsers}
          </p>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default Productivity;
