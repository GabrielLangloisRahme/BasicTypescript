import React, { Component } from "react";

// Below assigns data types do the state of the component

interface WorkOrderDetailState {
  orderName: string;
  orderStatus: string;
  assignee: string[];
  statusToggle: boolean;
  dataFetched: boolean;
}

class WorkOrderDetail extends Component<any, WorkOrderDetailState> {
  public state: WorkOrderDetailState = {
    orderName: "",
    orderStatus: "",
    assignee: [""],
    statusToggle: false,
    dataFetched: false,
  };

  /*Once the component mounts data is fetched from the back end.
  This data is transformed so that the Order Name and Status
  is a single string, the status toggle is converted to a boolean
  and the AssigneeArray and EmailsArray are created from a conversion 
  from array of objects to array of strings.The Assignee is then set to
  a JSX element holding emails for titles (for the hover pin) with the content 
  holding namesi The state is then updated with this.*/

  async componentDidMount() {
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

      this.setState({
        orderName,
        orderStatus,
        assignee,
        statusToggle,
        dataFetched: true,
      });
    }
  }

  /* This function toggles the work order status in the back end
  and then reloads the website to rerender state fetching from 
  database in component did mount.*/

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

    window.location.reload();
  };

  render() {
    const { orderName, orderStatus, assignee, dataFetched } = this.state;

    /*The component does not output anything until the data is fetched.
 It then displays the Work Order Name, Status, Assignees with a hover
 email. It also has a toggle to open or close a work order*/

    if (dataFetched) {
      return (
        <div>
          <p>
            The work order {orderName} has the status {orderStatus}. The
            following users are assigned:
          </p>
          {assignee}
          <button type="button" onClick={this.toggleWorkOrder}>
            Click here to {this.state.statusToggle ? "close" : "open"} work
            order
          </button>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default WorkOrderDetail;
