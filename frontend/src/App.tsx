import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";

import Home from "./components/Home";
import WorkOrders from "./components/WorkOrders";
import WorkOrderDetail from "./components/WorkOrderDetail";
import Productivity from "./components/Productivity";
import NewWorkOrder from "./components/NewWorkOrder";

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
