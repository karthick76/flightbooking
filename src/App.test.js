import React from "react";
import { mount, shallow } from "enzyme";
import CreateBooking from "./components/CreateBooking";
import GetBookings from "./components/GetBookings";
import ViewAllFlights from "./components/ViewAllFlights";
import App from "./App";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { Route } from "react-router";

let pathMap = {};
describe("Testing Application Routing", () => {
  beforeAll(() => {
    const wrapper = shallow(<App />);
    pathMap = wrapper.find(Route).reduce((pathMap, route) => {
      const routeProps = route.props();
      pathMap[routeProps.path] = routeProps.component
        ? routeProps.component
        : routeProps.render;
      return pathMap;
    }, {});
  });

  it("TR 1 - should show ViewAllFlights component for / router", () => {
    try {
      let returnValue = pathMap["/"]();
      expect(returnValue.props.to).toBe("/viewFlights");
    } catch (err) {
      expect(pathMap["/"]).toBe(ViewAllFlights);
    }
  });

  it("TR 2 - should show ViewAllFlights component for /viewFlights router", () => {
    expect(pathMap["/viewFlights"]).toBe(ViewAllFlights);
  });

  it("TR 3 - should show CreateBooking component for /bookFlight/:flightId router", () => {
    expect(pathMap["/bookFlight/:flightId"]).toBe(CreateBooking);
  });

  it("TR 4 - should show GetBookings component for /viewBookings router", () => {
    expect(pathMap["/viewBookings"]).toBe(GetBookings);
  });
});

// -----------------------------------------------------------------------------------

describe("CreateBooking Component - submitBooking Method", () => {
  let flights = [
    {
      flightId: "IND-101",
      AircraftName: "Delta Airlines",
      fare: 600,
      availableSeats: 5,
      status: "Running",
    },
    {
      flightId: "IND-102",
      AircraftName: "JetBlue",
      fare: 750,
      availableSeats: 20,
      status: "Cancelled",
    },
    {
      flightId: "IND-103",
      AircraftName: "United Airlines",
      fare: 800,
      availableSeats: 10,
      status: "Running",
    },
    {
      flightId: "IND-104",
      AircraftName: "Express Jetcraft",
      fare: 900,
      availableSeats: 15,
      status: "Running",
    },
    {
      flightId: "IND-105",
      AircraftName: "Wonder Airlines",
      fare: 800,
      availableSeats: 10,
      status: "Cancelled",
    },
  ];

  it("CBT-1 - submitBooking method set successMessage property in success case", () => {
    try {
      const mock = new MockAdapter(axios);
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      wrapper.setState({
        bookingForm: {
          customerId: "R1234",
          flightId: "IND-101",
          noOfTickets: 2,
        },
        flights,
      });
      mock
        .onPost("http://localhost:1050/bookings", wrapper.state.bookingForm)
        .reply(200, "success message");
      new Promise((resolve, reject) => {
        wrapper.instance().submitBooking({
          preventDefault: () => {
            wrapper.setState({ it: "hello" });
          },
        });
        resolve("success case");
      })
        .then((data) => {
          expect(wrapper.state("successMessage")).toBe("success message");
          expect(wrapper.state("errorMessage")).toBe("");
        })
        .catch((err) => {});
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-2 - submitVisit method set errorMessage property in error case", () => {
    try {
      const mock = new MockAdapter(axios);
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      wrapper.setState({
        bookingForm: {
          customerId: "R1234",
          flightId: "IND-101",
          noOfTickets: 2,
        },
        flights,
      });
      mock
        .onPost("http://localhost:1050/bookings", wrapper.state.bookingForm)
        .reply(404, "error message");
      new Promise((resolve, reject) => {
        wrapper.instance().submitBooking({
          preventDefault: () => {
            wrapper.setState({ it: "hello" });
          },
        });
        resolve("error case");
      })
        .then((data) => {
          expect(wrapper.state("successMessage")).toBe("");
          expect(wrapper.state("errorMessage")).toBe("error message");
        })
        .catch((err) => {});
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-3 - submitBooking method should be invoked on form submission", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      let submitVisitSpy = jest.spyOn(wrapper.instance(), "submitBooking");
      wrapper.setState({ flights }); // to force re render the component
      let formTag = wrapper.find("form");
      formTag.simulate("submit", { preventDefault: () => {} });
      expect(submitVisitSpy).toHaveBeenCalled();
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });
});

describe("CREATE BOOKING COMPONENT- form and buttons checking", () => {
  it("CBT-4 - Create Booking component has a form", () => {
    const wrapper = shallow(
      <CreateBooking match={{ params: { flightId: "IND-101" } }} />
    );
    expect(wrapper.find("form")).toHaveLength(1);
  });

  it("CBT-5 - Create Booking component has three fields (2 inputs & 1 dropdown)", () => {
    const wrapper = shallow(
      <CreateBooking match={{ params: { flightId: "IND-101" } }} />
    );
    expect(wrapper.find("form").find("input").length).toEqual(3);
  });

  it("CBT-6 - Name prop of all the input fields is proper", () => {
    const wrapper = shallow(
      <CreateBooking match={{ params: { flightId: "IND-101" } }} />
    );
    let status = false;
    if (
      wrapper.find("form").find("input").at(0).props().name == "flightId" &&
      wrapper.find("form").find("input").at(1).props().name == "customerId" &&
      wrapper.find("form").find("input").at(2).props().name == "noOfTickets"
    ) {
      status = true;
    }
    expect(status).toEqual(true);
  });

  it("CBT-7 - All input fields of CreateBooking component have formcontrol class", () => {
    const wrapper = shallow(
      <CreateBooking match={{ params: { flightId: "IND-101" } }} />
    );
    let customerId = wrapper
      .find('input[name="customerId"]')
      .hasClass("form-control");
    let noOfTickets = wrapper
      .find('input[name="noOfTickets"]')
      .hasClass("form-control");
    let flightId = wrapper
      .find('input[name="flightId"]')
      .hasClass("form-control");
    expect(customerId && noOfTickets && flightId).toEqual(true);
  });

  it("CBT-8 - customerId field of CreateBooking component have respective ids", () => {
    const wrapper = shallow(
      <CreateBooking match={{ params: { flightId: "IND-101" } }} />
    );
    expect(wrapper.find('input[name="customerId"]').props().id).toBe(
      "customerId"
    );
  });

  it("CBT-9 - noOfTickets field of CreateBooking component have respective ids", () => {
    const wrapper = shallow(
      <CreateBooking match={{ params: { flightId: "IND-101" } }} />
    );
    expect(wrapper.find('input[name="noOfTickets"]').props().id).toBe(
      "noOfTickets"
    );
  });

  it("CBT-10 - flightId field of CreateBooking component have respective ids", () => {
    const wrapper = shallow(
      <CreateBooking match={{ params: { flightId: "IND-101" } }} />
    );
    expect(wrapper.find('input[name="flightId"]').props().id).toBe("flightId");
  });

  it("CBT-11 - All input fields of CreateBooking component have formcontrol class", () => {
    const wrapper = shallow(
      <CreateBooking match={{ params: { flightId: "IND-101" } }} />
    );

    let flightId = wrapper.find('input[name="flightId"]').props().disabled;
    expect(flightId).toEqual(true);
  });

  it("CBT-12 - CustomerId and noOfTickets input fields of CreateBooking component call handleChange method on change", () => {
    const wrapper = shallow(
      <CreateBooking match={{ params: { flightId: "IND-101" } }} />
    );
    let customerId = wrapper.find('input[name="customerId"]').props().onChange;
    let noOfTickets = wrapper
      .find('input[name="noOfTickets"]')
      .props().onChange;

    expect(customerId && noOfTickets).toBeTruthy();
  });

  it("CBT-13 - Create Booking component has a button", () => {
    const wrapper = shallow(
      <CreateBooking match={{ params: { flightId: "IND-101" } }} />
    );
    expect(wrapper.find("form").find("button")).toHaveLength(1);
  });

  it("CBT-14 - button should have be disabled if buttonActive is false", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      const { form } = wrapper.state();
      form.buttonActive = false;
      let bookingButton = wrapper.find("#bookingBtn");
      expect(bookingButton.props().disabled).toBe(true);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-15 - button should have proper bootstrap class", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      const { form } = wrapper.state();
      form.buttonActive = false;
      let bookingButton = wrapper.find("#bookingBtn");
      expect(bookingButton.props().className).toContain("btn-primary");
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-16 - form level success and error messages of CreateBooking component have proper name attribute", () => {
    const wrapper = shallow(
      <CreateBooking match={{ params: { flightId: "IND-101" } }} />
    );
    wrapper.setState({ errorMessage: true });
    expect(
      wrapper.find('[name="errorMessage"]').length +
        wrapper.find('[name="successMessage"]').length
    ).toEqual(2);
  });

  it("CBT-17 - successMessage should have proper bootstrap class", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      wrapper.setState({ successMessage: "success" });
      let successMessageTag = wrapper.find("#successMessage");
      expect(successMessageTag.props().className).toContain("text-success");
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-18 - successMessage should be displayed only when sucessMessage is there", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      let successMessageTag = wrapper.find("#successMessage");
      wrapper.setState({ successMessage: "success" });
      successMessageTag = wrapper.find("#successMessage");
      expect(successMessageTag).toHaveLength(1);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-19 - errorMessage should have proper bootstrap class", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      wrapper.setState({ errorMessage: "error" });
      let bookingButton = wrapper.find("#errorMessage");
      expect(bookingButton.props().className).toContain("text-danger");
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-20 - errorMessage should be displayed only when errorMessage is there", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      let errorMessageTag = wrapper.find("#errorMessage");
      wrapper.setState({ errorMessage: "error" });
      errorMessageTag = wrapper.find("#errorMessage");
      expect(errorMessageTag).toHaveLength(1);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-21 - Error message tags for all the fields have proper name attribute", () => {
    const wrapper = shallow(
      <CreateBooking match={{ params: { flightId: "IND-101" } }} />
    );
    let formErrorMessage = Object.assign({}, wrapper.state().formErrorMessage);
    formErrorMessage.customerId = true;
    wrapper.setState({ formErrorMessage });
    expect(
      wrapper.find('[name="customerIdError"]').length +
        wrapper.find('[name="noOfTicketsError"]').length
    ).toEqual(2);
  });
});

describe("CreateBooking Component - Fields validation using validateField Method", () => {
  it('CBT-22 - customerId field displays error for "" value', () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      let flag = false;
      let count = 0;
      wrapper.instance().validateField("customerId", "");
      var msgArr = ["field", "is", "required"];
      var msg = wrapper.state().formErrorMessage.customerId;
      msg = msg.toLowerCase().split(" ");
      msgArr.forEach((element) => {
        if (msg.indexOf(element) != -1) {
          count += 1;
        }
      });
      if (count >= 2) flag = true;
      expect(flag).toEqual(true);
      expect(wrapper.state().formValid.customerId).toBe(false);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-23 - customerId field displays error for a123 value", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      let flag = false;
      let count = 0;
      wrapper.instance().validateField("customerId", "a123");
      var msgArr = [
        "It",
        "should",
        "start",
        "with",
        "a",
        "capital",
        "letter",
        "and",
        "followed",
        "by",
        "4",
        "digit",
      ];
      var msg = wrapper.state().formErrorMessage.customerId;
      msg = msg.toLowerCase().split(" ");
      msgArr.forEach((element) => {
        if (msg.indexOf(element) != -1) {
          count += 1;
        }
      });
      if (count >= 7) flag = true;
      expect(flag).toEqual(true);
      expect(wrapper.state().formValid.customerId).toBe(false);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-24 - customerId field displays no error for R1234", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      wrapper.instance().validateField("customerId", "R1234");
      expect(wrapper.state().formErrorMessage.customerId).toEqual("");
      expect(wrapper.state().formValid.customerId).toEqual(true);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it('CBT-25 - noOfTickets field displays error for "" value', () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      let flag = false;
      let count = 0;
      wrapper.instance().validateField("noOfTickets", "");
      var msgArr = ["field", "is", "required"];
      var msg = wrapper.state().formErrorMessage.noOfTickets;
      msg = msg.toLowerCase().split(" ");
      msgArr.forEach((element) => {
        if (msg.indexOf(element) != -1) {
          count += 1;
        }
      });
      if (count >= 2) flag = true;
      expect(flag).toEqual(true);
      expect(wrapper.state().formValid.noOfTickets).toBe(false);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-26 - noOfTickets field displays error for 0", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      let flag = false;
      let count = 0;
      wrapper.instance().validateField("noOfTickets", 0);
      var msgArr = ["Length", "should", "be", "between", "1", "and", "10"];
      var msg = wrapper.state().formErrorMessage.noOfTickets;
      msg = msg.toLowerCase().split(" ");
      msgArr.forEach((element) => {
        if (msg.indexOf(element) != -1) {
          count += 1;
        }
      });
      if (count >= 3) flag = true;
      expect(flag).toEqual(true);
      expect(wrapper.state().formValid.noOfTickets).toBe(false);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-27 - noOfTickets field displays error for 12", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      let flag = false;
      let count = 0;
      wrapper.instance().validateField("noOfTickets", 12);
      var msgArr = ["Length", "should", "be", "between", "1", "and", "10"];
      var msg = wrapper.state().formErrorMessage.noOfTickets;
      msg = msg.toLowerCase().split(" ");
      msgArr.forEach((element) => {
        if (msg.indexOf(element) != -1) {
          count += 1;
        }
      });
      if (count >= 3) flag = true;
      expect(flag).toEqual(true);
      expect(wrapper.state().formValid.noOfTickets).toBe(false);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-28 - noOfTickets field displays no error for 4", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      wrapper.instance().validateField("noOfTickets", 4);
      expect(wrapper.state().formErrorMessage.noOfTickets).toEqual("");
      expect(wrapper.state().formValid.noOfTickets).toEqual(true);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-29 - buttonActive state to be false when either customerId or noOfTickets is false", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      wrapper.instance().validateField("noOfTickets", 12);
      expect(wrapper.state().formValid.buttonActive).toEqual(false);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });
  
  it("CBT-30 - buttonActive state to be false when either customerId or noOfTickets is false", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      wrapper.instance().validateField("customerId", "a12");
      expect(wrapper.state().formValid.buttonActive).toEqual(false);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("CBT-31 - buttonActive state to be true when both customerId and noOfTickets are true", () => {
    try {
      const wrapper = shallow(
        <CreateBooking match={{ params: { flightId: "IND-101" } }} />
      );
      wrapper.instance().validateField("customerId", "R1234");
      wrapper.instance().validateField("noOfTickets", 4);
      expect(wrapper.state().formValid.buttonActive).toEqual(true);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });
});

describe('Booking Component - handleChange Method', () => {

  it('CBT-32 - Should assign the recieved data for customerId to proper bookingForm state property', () => {
      try {
          const wrapper = shallow(<CreateBooking match={{ params: { flightId: "IND-101" } }} />);
          const { form } = wrapper.state();
          expect(form.customerId).toBe("");
          wrapper.instance().handleChange({ target: { name: "customerId", value: "R1234" } });
          expect(wrapper.state().form.customerId).toBe("R1234");
      } catch (err) {
          expect(err.message).not.toEqual(err.message);
      }
  })

  it('CBT-33 - handleChange method should not return any value', () => {
      try {
          const wrapper = shallow(<CreateBooking match={{ params: { flightId: "IND-101" } }} />);
          let returnValue = wrapper.instance().handleChange({ target: { name: "customerId", value: "R1234" } });
          expect(returnValue).toBe(undefined);
      } catch (err) {
          expect(err.message).not.toEqual(err.message);
      }
  })

  it('CBT-34 - Should assign the recieved data for noOfTickets to proper bookingForm state property', () => {
    try {
        const wrapper = shallow(<CreateBooking match={{ params: { flightId: "IND-101" } }} />);
        const { form } = wrapper.state();
        expect(form.noOfTickets).toBe("");
        wrapper.instance().handleChange({ target: { name: "noOfTickets", value: "4" } });
        expect(wrapper.state().form.noOfTickets).toBe("4");
    } catch (err) {
        expect(err.message).not.toEqual(err.message);
    }
})

it('CBT-35 - handleChange method should not return any value', () => {
    try {
        const wrapper = shallow(<CreateBooking match={{ params: { flightId: "IND-101" } }} />);
        let returnValue = wrapper.instance().handleChange({ target: { name: "noOfTickets", value: "4" } });
        expect(returnValue).toBe(undefined);
    } catch (err) {
        expect(err.message).not.toEqual(err.message);
    }
})

})

describe("GetBookings component - Testing render method", () => {
  const bookingData = [
    {
      customerId: "R1234",
      flightId: "IND-101",
      noOfTickets: "2",
      bookingCost: 1200,
      id: 1,
    },
  ];
  
  it("GBT-1 - GetBooking component should have a table tag with className 'table-striped' ", () => {
    try {
      const wrapper = shallow(<GetBookings />);
      wrapper.setState({ bookingData });
      expect(wrapper.find("table").props().className).toContain(
        "table-striped"
      );
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("GBT-2 - GetBooking component -- success message tag with className 'text-success' ", () => {
    try {
      const wrapper = shallow(<GetBookings />);
      wrapper.setState({ bookingData });
      expect(wrapper.find("#successMessage").props().className).toContain(
        "text-success"
      );
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("GBT-3 - GetBooking component -- error message tag with className 'text-danger' ", () => {
    try {
      const wrapper = shallow(<GetBookings />);
      wrapper.setState({ bookingData });
      expect(wrapper.find("#errorMessage").props().className).toContain(
        "text-danger"
      );
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("GBT-4 - GetBooking component -- should display error message when no bookings is found ", () => {
    try {
      const wrapper = shallow(<GetBookings />);
      expect(wrapper.find(".card").props().children[1]).toContain(
        "No bookings available to show"
      );
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("GBT-5 - GetBooking component -- tbody with button tag and className 'btn-danger' ", () => {
    try {
      const wrapper = shallow(<GetBookings />);
      wrapper.setState({ bookingData });
      expect(wrapper.find("button").props().className).toContain("btn-danger");
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("GBT-6 - GetBooking component should have a table tag inside div tag with 'card-body' class", () => {
    try {
      const wrapper = shallow(<GetBookings />);
      wrapper.setState({ bookingData });
      expect(wrapper.find(".card-body").props().children[0].type).toContain( "table" );
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });
});

describe("ViewAllFlights component - Testing render method", () => {
  const flights = [
    {
      flightId: "IND-101",
      AircraftName: "Delta Airlines",
      fare: 600,
      availableSeats: 5,
      status: "Running",
    },
  ];

  it("VT-1 - Should display error message when no data is available", () => {
    try {
      const wrapper = shallow(<ViewAllFlights />);
      expect(wrapper.find(".container").props().children[0]).toContain(
        "No flights to show"
      );
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("VT-2 - Should contain Book button when data is available", () => {
    try {
      const wrapper = shallow(<ViewAllFlights />);
      wrapper.setState({ flights });
      expect(wrapper.find("button").props().className).toContain("btn-primary");
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("VT-3 - Should display errorMessage with 'text-danger' class", () => {
    try {
      const wrapper = shallow(<ViewAllFlights />);
      wrapper.setState({ flights });
      expect(
        wrapper.find('span[name="errorMessage"]').props().className
      ).toContain("text-danger");
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("VT-4 - Should display flightName in card-header when data is available", () => {
    try {
      const wrapper = shallow(<ViewAllFlights />);
      wrapper.setState({ flights });
      expect(wrapper.find('.card-header').props().children).toContain('Delta Airlines');
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("VT-5 - Should display flightId inside card-body when data is available", () => {
    try {
      const wrapper = shallow(<ViewAllFlights />);
      wrapper.setState({ flights });
      expect(wrapper.find('.card-title').props().children).toContain('IND-101');
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("VT-6 - Should display flight fare inside card-body when data is available", () => {
    try {
      const wrapper = shallow(<ViewAllFlights />);
      wrapper.setState({ flights });
      // console.log(wrapper.find('.card-text').props().children);
      expect(wrapper.find('.card-text').props().children).toContain(600);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  });

  it("VT-7 - Should redirect to CreateBooking page on click of Book button",()=>{
    try {
      
      const wrapper = shallow(<ViewAllFlights />);
      wrapper.setState({ flights });      
      expect(wrapper.find('.card-text').props().children).toContain(600);
    } catch (err) {
      expect(err.message).not.toEqual(err.message);
    }
  })

});
