import React, { Component } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

const url = "http://localhost:1050/bookings/";
const url1 = "http://localhost:1050/flightDb/";

class CreateBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        customerId: "",
        flightId: this.props.match.params.flightId,
        noOfTickets: "",
      },
      formErrorMessage: {
        customerId: "",
        flightId: "",
        noOfTickets: "",
      },
      formValid: {
        customerId: false,
        flightId: true,
        noOfTickets: false,
        buttonActive: false,
      },
      flights: [],
      errorMessage: "",
      successMessage: "",
    };
  }

  submitBooking = (event) => {
    const myFlight = this.state.flights.find((flight) => 
    flight.flightId == this.state.form.flightId);
    const bookingCost = myFlight.fare * this.state.form.noOfTickets;
    const newForm = {
      ...this.state.form,
      bookingCost: bookingCost,
    };
    axios
    .post(url, newForm)
    .then((res)=>{
        this.setState({
          successMessage: "Booking created successfully!!",
          errorMessage: "",
        });
    })
    .catch((error) => {
      if (error.response == undefined) {
        this.setState({
          errorMessage: "Please start your JSON Server",
          successMessage: "",
        });
      } else if (error.response.status == 404) {
        this.setState({
          errorMessage: "Booking Failed!",
          successMessage: "",
        });
      }
    });
};


  fetchFlights = () => {
    axios
      .get(url1)
      .then((response) => {
        const data = response.data;
        const newState = {
          flights: data,
          errorMessage: "",
        };
        this.setState(newState);
      })
      .catch((error) => {
        if (error.response == undefined) {
          this.setState({ errorMessage: "Start your JSON server" });
        } else if (error.response.status === 404) {
          this.setState({
            errorMessage: "Could not fetch flights data",
            flights: [],
          });
        }
      });
    /* 
      Make a axios GET request to http://localhost:1050/flightDb/ to fetch the flight's array 
      from the server,use this array to calculate booking cost for a booking and pass bookingCost along with
      other data inside form on post request
       handle the success and error cases appropriately 
    */
  };
  componentDidMount() {
    this.fetchFlights();
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.submitBooking();
  };

  handleChange = (event) => {
       const name = event.target.name;
        const value = event.target.value;
        const newState={
            form: {
              ...this.state.form,
              [name]: value,
            },
          };
          this.setState(newState);
          this.validateField(name, value)
  };

  validateField = (fieldName, value) => {
    const { formErrorMessage, formValid } = this.state;
        switch (fieldName) {
          
          case "customerId":
            if (value === "") {
              formErrorMessage.customerId = "Please enter a Customer Id";
              formValid.customerId = false;
            }
              else if(!value.match(/^[A-Z]{1}[0-9]{4}$/)){
                formErrorMessage.customerId="It Should start with a captial letter and followed by a 4 digit";
                formValid.customerId=false;
              }
             else {
              formErrorMessage.customerId = "";
              formValid.customerId = true;
            }
            break;

            case "noOfTickets":
            if (value === "") {
              formErrorMessage.noOfTickets = "Please enter a Tickets";
              formValid.noOfTickets = false;
            } else {
              formErrorMessage.noOfTickets = "";
              formValid.noOfTickets = true;
            }
            break;
           
          default:
            break;
        }
  };

  render() {
   const { form, formValid, formErrorMessage, successMessage, errorMessage } = this.state;
    return (
      <form className="container" onSubmit={this.handleSubmit}>
      <div className="CreateBooking">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <br />
            <div className="card">
              <div className="card-header bg-custom">
                <h3>Flight Booking Form</h3>
              </div>
              <div className="card-body">
                { 
                  <div class="form-group">
                    <h1>{this.state.name}</h1>
                  <label className="font-weight-bold">Customer Id</label>
                  <input type="text" className="form-control" 
                  value={this.state.form.customerId}
                  name="customerId" placeholder="e.g.- P1001" onChange={this.handleChange}></input>
                  <p className="text-danger">{this.state.formErrorMessage.customerId}</p>
                 
                   <label className="font-weight-bold">Flight Id</label>
                   <input type="text" className="form-control" value={this.state.form.flightId} 
                   disabled 
                   name="flightId" 
                   onChange={this.handleChange}></input>
                  <br/>
                  
                   <label className="font-weight-bold">Number of Tickets</label>
                   <input type="number" className="form-control"
                   value={this.state.form.noOfTickets} name="noOfTickets"
                   placeholder="min-1 max-10" min="1" max="10" onChange={this.handleChange}></input>
                   <p className="text-danger">{this.state.formErrorMessage.noOfTickets}</p>
                   </div>  
                }
                <button type="submit" 
                disabled={
                  !(this.state.formValid.customerId && this.state.formValid.noOfTickets)
                } className="btn btn-primary" >Book Flight</button>
                <p className="text-success">{this.state.successMessage}</p>
                <div align="center">
                  {
                     <p className="text-danger">{this.state.ErrorMessage}</p>
                  }
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </form>
   
    );
  }
}


export default CreateBooking;
