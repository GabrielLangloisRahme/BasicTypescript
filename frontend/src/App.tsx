import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

function Home() {
  return (
    <>
      <p>
        Take me to the <Link to="/example">Example Page</Link>.
      </p>
    </>
  );
}

interface IExampleState {
  favorite: {
    id: number;
    name: string;
    email: string;
  } | null;
}

class Example extends Component<any, IExampleState> {
  public state: IExampleState = {
    favorite: null,
  };

  render() {
    const { favorite } = this.state;

    return (
      <div>
        {!!favorite && (
          <p>My favorite Morty is <strong>{favorite.name}</strong>!</p>
        )}
        <button type="button" onClick={this.handleHelloWorld}>
          Who's my favorite Morty?
        </button>
      </div>
    );
  }

  private handleHelloWorld = async () => {
    const response = await fetch("/api/example", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: Math.floor(1 + Math.random() * 9) }),
    });
    const jsonResponse = await response.json();
    this.setState({ favorite: jsonResponse.favorite });
  };
}

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <img src={logo} className="app-logo" alt="logo" />
          <div className="app-body">
            <Route exact path="/" component={Home} />
            <Route path="/example" component={Example} />
          </div>
        </div>
      </Router>
    );
  }
}
