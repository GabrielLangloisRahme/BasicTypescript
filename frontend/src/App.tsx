import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
} from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

function Home() {
  return (
    <>
      <p>
        Take me to the <Link to="/workOrders">Work Order Page</Link>.
      </p>
      <p>
        Take me to the <Link to="/productivity"> Available Users Page</Link>.
      </p>
      <p>
        Take me to the{" "}
        <Link to="/workOrders/new">Create a Work Order Page</Link>.
      </p>
    </>
  );
}

interface WorkOrdersState {
  workOrders:
    | [
        {
          id: number;
          name: string;
          status: string;
        }
      ]
    | null;
  workOrdersExist: boolean;
}

class WorkOrders extends Component<any, WorkOrdersState> {
  public state: WorkOrdersState = {
    workOrders: null,
    workOrdersExist: true,
  };

  async componentWillMount() {
    let res = await fetch("/api/workOrders", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await res.json();

    this.setState({ workOrders: jsonResponse.workOrders });
    this.setState({ workOrdersExist: jsonResponse.workOrders ? true : false });
  }

  render() {
    const { workOrders } = this.state;
    let displayWorkOrders;
    let url = "/workOrderDetail/";

    if (workOrders) {
      displayWorkOrders = workOrders.map(({ id, name, status }) => {
        let linkUrl = url.concat(id.toString());
        return (
          <p>
            Work order {name} has a status of {status}. Click{" "}
            <Link to={linkUrl}>here</Link> for details
          </p>
        );
      });
    } else if (this.state.workOrdersExist) {
      displayWorkOrders = <p></p>;
    } else {
      displayWorkOrders = <p>There are no work orders at this time</p>;
    }
    return (
      <div>
        {displayWorkOrders}
        {/* {!!favorite && (
          <p>
            My favorite Morty is <strong>{favorite.name}</strong>!
          </p>
        )}
        <p>
          This button{" "}
          <button type="button" onClick={this.handleHelloWorld}>
            Who's my favorite Morty?
          </button>
        </p> */}
      </div>
    );
  }

  // private handleHelloWorld = async () => {
  //   const response = await fetch("/api/example", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ id: Math.floor(1 + Math.random() * 9) }),
  //   });
  //   const jsonResponse = await response.json();
  //   this.setState({ favorite: jsonResponse.favorite });
  // };
}

interface WorkOrderDetailState {
  orderName: string;
  orderStatus: string;
  assignee: string[];
  statusToggle: boolean;
}

class WorkOrderDetail extends Component<any, WorkOrderDetailState> {
  public state: WorkOrderDetailState = {
    orderName: "",
    orderStatus: "",
    assignee: [""],
    statusToggle: false,
  };

  async componentWillMount() {
    let res = await fetch("/api/workOrderDetail", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.props.match.params.id }),
    });
    const jsonResponse = await res.json();

    if (jsonResponse.workOrderDetail) {
      let workOrderDetail = jsonResponse.workOrderDetail;

      let orderName = workOrderDetail.map(
        (obj: { orderName: string }) => obj.orderName
      )[0];

      let orderStatus = workOrderDetail.map(
        (obj: { orderStatus: string }) => obj.orderStatus
      )[0];

      let assigneeArray = workOrderDetail.map(
        (obj: { assignee: string[] }) => obj.assignee
      );

      let emailArray = workOrderDetail.map(
        (obj: { email: string[] }) => obj.email
      );

      let assignee = assigneeArray.map((assignee: string, index: number) => {
        if (assignee) {
          return <p title={emailArray[index]}>{assignee}</p>;
        }
      });

      let statusToggle = workOrderDetail.map(
        (obj: { statusToggle: boolean }) => !!obj.statusToggle
      )[0];

      this.setState({ orderName, orderStatus, assignee, statusToggle });

      console.log("this is the state", this.state);
    }
  }

  private toggleWorkOrder = async () => {
    let status: string;
    if (this.state.statusToggle) {
      status = "CLOSED";
    } else {
      status = "OPEN";
    }
    let res = await fetch("/api/toggleWorkOrder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.props.match.params.id, status }),
    });
    const jsonResponse = await res.json();

    if (jsonResponse.workOrderDetail) {
      let workOrderDetail = jsonResponse.workOrderDetail;

      let orderName = workOrderDetail.map(
        (obj: { orderName: string }) => obj.orderName
      )[0];

      let orderStatus = workOrderDetail.map(
        (obj: { orderStatus: string }) => obj.orderStatus
      )[0];

      let assigneeArray = workOrderDetail.map(
        (obj: { assignee: string[] }) => obj.assignee
      );

      let emailArray = workOrderDetail.map(
        (obj: { email: string[] }) => obj.email
      );

      let assignee = assigneeArray.map((assignee: string, index: number) => {
        if (assignee) {
          return <p title={emailArray[index]}>{assignee}</p>;
        }
      });

      let statusToggle = workOrderDetail.map(
        (obj: { statusToggle: boolean }) => !!obj.statusToggle
      )[0];

      this.setState({ orderName, orderStatus, assignee, statusToggle });
    }
  };

  render() {
    const { orderName, orderStatus, assignee, statusToggle } = this.state;
    let displayContent;

    return (
      <div>
        <p>
          The work order {orderName} has the status {orderStatus}. The following
          users are assigned:
        </p>
        {assignee}
        <button type="button" onClick={this.toggleWorkOrder}>
          Click here to {this.state.statusToggle ? "close" : "open"} work order
        </button>
      </div>
    );
  }
}

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

withRouter(NewWorkOrder);

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Route exact path="/" component={Home} />
          <Route exact path="/workOrders" component={WorkOrders} />
          <Route
            exact
            path="/workOrderDetail/:id"
            component={WorkOrderDetail}
          />
          <Route exact path="/productivity" component={Productivity} />
          <Route exact path="/workOrders/new" component={NewWorkOrder} />
        </div>
      </Router>
    );
  }
}
