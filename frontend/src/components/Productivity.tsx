import React, { Component } from "react";

interface ProductivityState {
  availableUsers: string | null;
}

class Productivity extends Component<any, ProductivityState> {
  public state: ProductivityState = {
    availableUsers: null,
  };

  async componentWillMount() {
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
      this.setState({ availableUsers: availableUsers.join(", ") });
    }
  }

  render() {
    let displayAvailableUsers;
    if (this.state.availableUsers) {
      displayAvailableUsers =
        "These are the available users that are not currently in a open work order: " +
        this.state.availableUsers;
    }

    return (
      <div>
        <p>{displayAvailableUsers}</p>
      </div>
    );
  }
}

export default Productivity;
