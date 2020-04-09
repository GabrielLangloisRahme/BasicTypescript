import React, { Component } from "react";
import { withRouter } from "react-router-dom";

interface NewWorkOrderState {
  availableUsers: string[] | null;
  workOrderName: string;
  checked: any;
  error: string;
}

class NewWorkOrder extends Component<any, Partial<NewWorkOrderState>> {
  public state: NewWorkOrderState = {
    availableUsers: null,
    workOrderName: "",
    checked: false,
    error: "",
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

      this.setState({ availableUsers: availableUsers });
    }
  }
  private handleSubmit = async (event: any) => {
    event.preventDefault();

    let object: any = this.state;
    let usersArray: any = [];
    let name;

    for (let property in object) {
      if (object[property] === true) {
        usersArray.push(property);
      }
      if (property === "name") {
        name = object[property];
      }
    }
    console.log("this is the name", name);

    console.log("this is the users", usersArray);

    let res = await fetch("/api/addWorkOrder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: usersArray, name }),
    });

    let dataRes = await res.json();
    if (dataRes.success) {
      this.props.history.push("/");
    } else {
      this.setState({
        error:
          "There was an error submitting the form, please input values and try again",
      });
    }
  };

  private handleChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  render() {
    console.log("these are the available users", this.state.availableUsers);
    let availableUsersCheckbox;
    if (this.state.availableUsers) {
      availableUsersCheckbox = this.state.availableUsers.map((name) => (
        <div>
          <label>
            {name}:
            <input name={name} type="checkbox" onChange={this.handleChange} />
          </label>
        </div>
      ));
    }

    return (
      <form id="workOrder" onSubmit={this.handleSubmit} method="POST">
        <p>Fill the form below to create a new open work order</p>
        <label>
          Name of Work Order:
          <input name="name" type="text" onChange={this.handleChange} />
        </label>
        <br />
        {availableUsersCheckbox}
        <br />
        <input type="submit" />
        <p style={{ color: "Maroon" }}>{this.state.error}</p>
      </form>
    );
  }
}

export default withRouter(NewWorkOrder);
