import React, { Component } from "react";

import { Link } from "react-router-dom";
//This specifies the state type holding displayWorkOrder jsx state, and dataFetched boolean to identify when the data is fetched

interface WorkOrdersState {
  displayWorkOrders: any;
  dataFetched: boolean;
}

class WorkOrders extends Component<any, WorkOrdersState> {
  public state: WorkOrdersState = {
    displayWorkOrders: "",
    dataFetched: false,
  };

  /*Once the component mount, all work  orders are fetched. This data is holds the work
  order id, name and status. The data is transformed and  inputted into a JSX State component
  and displayed to the front end when the data is fetched */

  async componentDidMount() {
    let res = await fetch("/api/workOrders", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await res.json();

    if (jsonResponse.workOrders) {
      let { workOrders } = jsonResponse;
      let url = "/workOrderDetail/";

      let displayWorkOrders = workOrders.map(
        (obj: { id: any; name: string; status: string }) => {
          let linkUrl = url.concat(obj.id.toString());
          return (
            <p>
              Work order {obj.name} has a status of {obj.status}. Click{" "}
              <Link to={linkUrl}>here</Link> for details
            </p>
          );
        }
      );
      this.setState({
        displayWorkOrders: displayWorkOrders,
        dataFetched: true,
      });
    }
  }

  render() {
    return <div>{this.state.displayWorkOrders}</div>;
  }
}

export default WorkOrders;
