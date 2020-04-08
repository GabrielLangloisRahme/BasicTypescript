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
    </>
  );
}

interface WorkOrdersState {
  workOrders: {
    id: number;
    name: string;
    status: string;
  } | null;
}

class WorkOrders extends Component<any, WorkOrdersState> {
  public state: WorkOrdersState = {
    workOrders: null,
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
  }

  render() {
    const { workOrders } = this.state;
    {
      console.log("this is the data structure", workOrders);
    }
    return (
      <div>
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

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <img src={logo} className="app-logo" alt="logo" />
          <div className="app-body">
            <Route exact path="/" component={Home} />
            <Route path="/workOrders" component={WorkOrders} />
          </div>
        </div>
      </Router>
    );
  }
}
