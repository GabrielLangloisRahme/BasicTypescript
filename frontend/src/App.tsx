import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
  users:
    | [
        {
          name: string;
        }
      ]
    | null;
  availableUsers: string[] | null;
}

class Productivity extends Component<any, ProductivityState> {
  public state: ProductivityState = {
    users: null,
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
    this.setState({ users: jsonResponse.users });

    if (this.state.users) {
      const availableUsers = this.state.users.map(({ name }) => name);
      console.log("these are the users with no work orders 2", availableUsers);
      this.setState({ availableUsers: availableUsers });
    }
  }

  render() {
    let displayAvailableUsers =
      "These are the available users that are not currently in a work order: ";
    let numberAvailableUsers = this.state.availableUsers
      ? this.state.availableUsers
      : 0;
    let displaySentence;
    if (this.state.availableUsers) {
      displayAvailableUsers += this.state.availableUsers.join(" ");
    } else {
      displayAvailableUsers =
        "There are no available users since everyone is in a work order.";
    }

    return (
      <div>
        <p>{displayAvailableUsers}</p>
      </div>
    );
  }
}

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <img src={logo} className="app-logo" alt="logo" />
          <div className="app-body">
            <Route exact path="/" component={Home} />
            <Route path="/workOrders" component={WorkOrders} />
            <Route path="/workOrderDetail/:id" component={WorkOrderDetail} />
            <Route path="/productivity" component={Productivity} />
          </div>
        </div>
      </Router>
    );
  }
}
