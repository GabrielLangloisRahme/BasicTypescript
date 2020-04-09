import React, { Component } from "react";
import { Link } from "react-router-dom";

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

export default Home;
