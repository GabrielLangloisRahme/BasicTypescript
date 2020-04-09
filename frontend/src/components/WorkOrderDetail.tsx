import React, { Component } from "react";

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

export default WorkOrderDetail;
