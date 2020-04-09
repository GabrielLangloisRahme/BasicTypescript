import React, { Component } from "react";

import { Link } from "react-router-dom";

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
    return <div>{displayWorkOrders}</div>;
  }
}

export default WorkOrders;
