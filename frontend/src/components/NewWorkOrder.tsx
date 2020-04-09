import React, { Component } from "react";
import { withRouter } from "react-router-dom";

// This defines the data types used in the state of the component

interface NewWorkOrderState {
  availableUsers: string[] | null;
  workOrderName: string;
  checked: any;
  error: string;
  dataFetched: number;
}

/* Partial was used to allow the state to obtain more attributes than originally defined.
Unlike other components in the website, datafetch uses a number instead of a boolean to 
not confuse the code later that selectively captures checkboxes set to true into a user
array*/

class NewWorkOrder extends Component<any, Partial<NewWorkOrderState>> {
  public state: NewWorkOrderState = {
    availableUsers: null,
    workOrderName: "",
    checked: false,
    error: "",
    dataFetched: 0,
  };

  // This fetched all available users that are  not assigned to a work order, once fetched it flags this with dataFetched

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

      this.setState({ availableUsers: availableUsers, dataFetched: 1 });
    }
  }
  /* This takes the form data structures as name:WorkOrderName, SpecificUserName1:true/false, SpecificUserName3:true/false
  and selectively selectes the SpecificUserNames with value true and puts them into a user array. It then sends the user array
  and work order name to the front end. */

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

  /*This modifies the state such that the form name is added to it with the form value*/

  private handleChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  render() {
    //This creates a JSX object holding the checkboxes
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

    /*This returns a form holding a Name and Available users not assigned to a work order when user data is fetched from backend. 
    The form back end is structured to not accept work orders without a name or associated user. An error message is displayed when this happens */

    if (this.state.dataFetched === 1) {
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
    } else {
      return <div></div>;
    }
  }
}

export default withRouter(NewWorkOrder);
