//Show cards of all flights
import axios from "axios";
import React, { Component } from "react";
import {Route} from "react-router-dom";
import { Redirect } from "react-router-dom";
import CreateBooking from "./CreateBooking";
import {Link} from "react-router-dom";
const url1 = "http://localhost:1050/flightDb/";

export default class ViewAllFlights extends Component {
  
  state = {
    flights: [],
    errorMessage: "",
  };
  
  fetchFlights = () => {
    axios
    .get(url1)
    .then((res) => {
      this.setState({
        flights: res.data,
      });
    })
    .catch((err) => {
      console.log("err: ", err);
    });
  };

  componentDidMount() {
    this.fetchFlights();
  }
  
  render() {
    
    return (
      <div className="container p-3">
        {this.state.flights && this.state.flights.length > 0 ? (
          <div className="row">
            {/* Display all the fligts in the below card format */}

            {this.state.flights.map((flight) => (
              <div className="col-md-4 col-sm-6 mb-3">
                <div className="card col">
                  <div className="card-header">{flight.AircraftName}</div>
                  <div className="card-body">
                    <h5 className="card-title">
                      Flight Id : {flight.flightId}
                    </h5>
                    <p className="card-text">Fare : Rs. {flight.fare}</p>
                   <button
                     onClick={() =>this.props.history.push("bookFlights/"+flight.flightId)}
                      className="btn btn-primary btn-md btn-block">
                      Book
                    </button>
                    {/**/}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : "No flights to show!!!"}
        <div align="center">
           {/* Display rror message as given in QP */}
        </div>
      </div>
    );
  }
}
