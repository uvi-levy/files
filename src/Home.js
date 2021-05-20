import React, { Component } from "react";
import $ from "jquery";
// window.$ = $;
import { Container, Row, Col } from "react-bootstrap";
import { User } from "@leadercodes/leader-header";
import { Chart } from "./Chart";
import { Navbar } from "./Navbar";
import { Files } from "./Files";
// import { PreFile } from "./PreFile";
let url = window.location;
let userName = url.pathname.split("/")[1];

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {jwtFromCookie:'' ,files:[{}] };
  }

  componentDidMount() {
    console.log("in componentDidMount");
    var jwtFromCookie;
    if (window.location == "http://localhost:3000/uvi/comp") {
      jwtFromCookie =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1TEtTN0RQa1dzZHl3bW4xTGFSdjFnSTNSWUwyIiwiZW1haWwiOiJ1dmlAbGVhZGVyLmNvZGVzIiwiaXAiOiI4MC4xNzkuNTcuMjAxIiwiaWF0IjoxNjAzOTYyNjk3fQ.uZ4aMsxJOFlqOCoIHF3JGZZUAca-li9AahlilBbx_9o";
    } else {
      jwtFromCookie = document.cookie
        ? document.cookie
            .split(";")
            .filter((s) => s.includes("jwt"))[0]
            .split("=")
            .pop()
        : null;
    }

    this.setState({ jwtFromCookie }, () => {
      console.log(this.state.jwtFromCookie);
      console.log(userName);
      localStorage.setItem("userName", userName);

      this.loadFiles();
    });
  }
  loadFiles() {
    console.log("load");
    const jwtFromCookie = this.state.jwtFromCookie;

    $.ajax({
      type: "GET",
      url: "https://files.codes/api/" + localStorage.getItem("userName"),
      headers: { authorization: jwtFromCookie },
      success: (data) => {
        console.log("*data.length*", data.length);
        if (data.length > 0) {
          this.setState({ foldersFiles: data });
          const myFiles = [];
          data.forEach((file) => {
            if (file.name && file.size && file.dateCreated) {
              myFiles.push(file);
            }
          });
          console.log("myFiles" + myFiles.length);
          this.setState({ files: myFiles }, () => {
        console.log("files=="+this.state.files)
          });
        }
      },
    });
  }
  filterdFiles=(files)=>{
    console.log("filesFromParent"+files)
    this.setState({files})
  }

  render() {
    return (
      <>
        <Container fluid>
          <Row>
            <Col>
              <User />
            </Col>
            <Col>
              <Chart />
            </Col>
          </Row>
          <Row>
            <Col>
              <Navbar files={this.state.files} filterdFiles={(val)=> {this.filterdFiles(val)}} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Files files={this.state.files} />
            </Col>
            <Col>{/* <PreFile /> */}</Col>
          </Row>
        </Container>
      </>
    );
  }
}
