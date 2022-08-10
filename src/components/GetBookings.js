import axios from "axios";
import React, { Component } from "react";

const url1 = "http://localhost:1050/bookings/";

class GetBookings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingData: [],
      bookingId: "",
      errorMessage: "",
      successMessage: "",
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchBooking();
  }

  fetchBooking = () => {
    axios
      .get(url1)
      .then((response) => {
        const data = response.data;
        const newState = {
          bookingData: data,
          errorMessage: "",
          isLoading: false,
        };
        this.setState(newState);
      })
      .catch((error) => {
        if (error.response == undefined) {
          this.setState({
            errorMessage: "Please start your JSON Server",
            successMessage: "",
            isLoading: true,
          });
        } else if (error.response.status == 404) {
          this.setState({
            errorMessage: "Could not fetch booking data!",
            successMessage: "",
            isLoading: true,
          });
        }
      });
    /* 
      Send an AXIOS GET request to the url http://localhost:1050/bookings/ to fetch all the bookings 
      and handle the success and error cases appropriately.Set the isLoading to false once the request is complete
    */
  };

  deleteBooking = (id) => {
    axios
      .delete(url1 + id)
      .then((response) => {
        this.fetchBooking();
        this.setState({
          successMessage: "Booking deleted successfully!!",
        });
      })
      .catch((error) => {
        if (error.response == undefined) {
          this.setState({
            errorMessage: "Start your JSON Server",
            successMessage: "",
          });
        } else if (error.response.status == 404) {
          this.setState({
            errorMessage: "Booking deletion failed!",
            successMessage: "",
          });
        }
      });
    /*
      Send an AXIOS DELETE request to the url http://localhost:1050/bookings/:id where id represents the booking
      id for the selected booking which we want to delete
      and handle the success and error cases appropriately 
    */
  };

  render() {
    const { bookingData } = this.state;
    const rows = bookingData.map((booking) => (
      <tr key={booking.customerId}>
        <td><center>{booking.customerId}</center></td>
        <td><center>{booking.id}</center></td>
        <td><center>{booking.noOfTickets}</center></td>
        <td><center>{booking.bookingCost}</center></td>
        <td>
          <button 
            type="submit"
            onClick={()=>this.deleteBooking(booking.customerId)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    ));

    return (
      <div className="GetBooking">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <br />
            <div className="card">
              <div className="card-header bg-custom">
                <h3 align="center">
                  {this.state.isLoading && this.state.bookingData.length == 0
                    ? "Loading..."
                    : this.state.bookingData.length == 0 &&
                      this.state.isLoading == false
                    ? "Booking list is empty.Please book a Flight!"
                    : "Booking Details"}
                  {/*If booking list is empty and isLoading is true then display "Loading ...".
                  else If booking list is empty and isLoading is false display "Booking list is empty.Please book a Flight!"
                  else if booking list is not empty and isLoading is false display "Booking Details"
                   */}
                </h3>
              </div>
              {bookingData && bookingData.length > 0 ? (
                <div className="card-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Customer Id</th>
                        <th>Booking Id</th>
                        <th>Total tickets</th>
                        <th>Total cost</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                  </table>
                  <div align="center">
                    <span
                      name="successMessage"
                      id="successMessage"
                      className="text text-success"
                    >
                      {this.state.successMessage}
                    </span>
                    <span
                      name="errorMessage"
                      id="errorMessage"
                      className="text text-danger"
                    >
                      {this.state.errorMessage}
                    </span>
                  </div>
                  {/* code here to get the view as shown in QP for GetBooking component */}
                  {/* Display booking data in tabular form */}
                  {/* Display error message if the server is not running */}
                  {/* code appropriately to delete a booking on click of delete button */}
                </div>
              ) : this.state.errorMessage ? (
                <span className="text-danger">{this.state.errorMessage}</span>
              ) : (
                <span>No bookings to show</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GetBookings;
