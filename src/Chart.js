import React, { Component } from "react";
import { ProgressBar } from "react-bootstrap";
import $ from "jquery";
let userName;
let url = window.location;
if (window.location == "http://localhost:3000/uvi") {
  userName = "uvi";
} else {
  userName = url.pathname.split("/")[1];
}
export class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
  
 
    $.ajax({
      type: "GET",
      url: "https://files.codes/api/" + userName + "/getCount",
      headers: { authorization: this.props.jwt },
      error: (err) => {
        console.log(err);
      },
      success: (data) => {
        this.setState({ count: data.count }, () => {
          console.log(this.state.count.count);
        });
      },
    });
  }
  render() {
    return (
      <div
        className="chart"
        style={{
          height: "35px",
          textAlign: "center"
         
        }}
      >
        <p style={{ fontSize:'10px'}}>5/1000</p>
        <ProgressBar style={{ height: "6px",}} striped variant="info" now={20} />
      </div>
    );
  }
}
