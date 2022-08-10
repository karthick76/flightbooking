import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
// import the necessary modules here
import "./App.css";
import CreateBooking from "./components/CreateBooking";
import GetBooking from "./components/GetBookings";
import ViewAllFlights from "./components/ViewAllFlights";

class AppComp extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light  bg-custom">
            <span className="navbar-brand">Infy Airlines</span>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/viewFlights">
                  View and Book Flight
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/viewBookings">
                  View Bookings
                </Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/viewFlights" component={ViewAllFlights} />
            <Route path="/bookFlights/:flightId" component={CreateBooking} />
            <Route path="/viewBookings" component={GetBooking} />
            {/* <Route path="/" render={() => <Redirect to="/viewFlights" />} /> 
            <Route path="/bookFlight/:flightId" component={CreateBooking} /> */}
            {/*<Route path="*" render={() => <Redirect to="/viewFlights" />} /> */}
          </Switch>

          {/* code the required routes here */}
        </div>
      </Router>
    );
  }
}

export default AppComp;
