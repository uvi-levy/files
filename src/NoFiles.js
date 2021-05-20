import React, { Component } from "react";
import $ from "jquery";
import { Container, Row, Col, Button } from "react-bootstrap";
import FileCard from "./assets/Group.png";
import ResizePanel from "react-resize-panel";

var userName = localStorage.getItem("userName");

window.$ = $;

export class NoFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    console.log("no files");
  }
  
  render() {
    return (
      <Container fluid style={{ backgroundColor: "white"  ,textAlign: "center" }}>
     
        <Row >
          <Col style={{ marginTop: "5%"}}>
              <img src={FileCard} height="30%" />
            <h1>Oops......</h1>
            <h2>There are no files here</h2>
            <Button  style={{ marginTop: "5%"}}
              onClick={() => {
                this.props.goToUpload()
              }}
            >
              upload new file
            </Button>
          </Col>
       
        </Row>
      </Container>
    );
  }
}
