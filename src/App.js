import React, { Component } from "react";
import $ from "jquery";

import { Router, Switch, Route } from "react-router";
import { createBrowserHistory } from "history";
import ProtectedRoute from "./ProtectedRoute";
import { Home } from "./Home";
import { Chart } from "./Chart";
import { Files } from "./Files";
import { Upload } from "./Upload";
import { CreatableAdvanced } from "./Folders";
import { Archiv } from "./Archiv";
import { Err } from "./Err";
import { User } from "@leadercodes/leader-header";
import { Navbar } from "./Navbar";
import { NoFiles } from "./NoFiles";
import { Trash } from "./Trash";


import { Container, Row, Col } from "react-bootstrap";

const history = createBrowserHistory();

let url = window.location;
let userName = url.pathname.split("/")[1];

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jwtFromCookie: "",
      data: [],
      files: [{}],
      filterdFiles: [{}],
      next: false,
      noFiles: false,
    };
  }
  componentDidMount() {
    console.log("in componentDidMount");
    let jwtFromCookie;
    if (window.location == "http://localhost:3000/uvi") {
      jwtFromCookie =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJnS1h4ckFheVdlWE9VcWZOdGs2VllvdXRsRUwyIiwiZW1haWwiOiJ1dmlAbGVhZGVyLmNvZGVzIiwiaWF0IjoxNjE5NTk4MjMzfQ.4hcZDKwWHDsfZ9gLPU1r8pvqPpYm1Dr9XZ5xJY_hqlc";
    } else {
      jwtFromCookie = document.cookie
        ? document.cookie
            .split(";")
            .filter((s) => s.includes("jwt"))[0]
            .split("=")
            .pop()
        : null;
    }
    let params = new URL(document.location).searchParams;
    let jwtGlobal = params.get("jwt");
    if (jwtGlobal) {
      let newUrl = window.location.href;
      newUrl = newUrl.split("?jwt=");
      newUrl = newUrl[0];
      let date = new Date(Date.now() + 86400e3);
      date = date.toUTCString();
      var expires = "expires=" + date;
      document.cookie = "devJwt" + "=" + jwtGlobal + ";" + expires + ";path=/";
      window.location.replace(newUrl);
    }
    this.setState({ jwtFromCookie }, () => {
      this.loadFiles();
    });
  }
  loadFiles() {
    console.log("load");

    $.ajax({
      type: "GET",
      url: "https://files.codes/api/" + localStorage.getItem("userName"),
      headers: { authorization: this.state.jwtFromCookie },
      error: (err) => {
        if (err.status == 401) {
          window.location = "https://dev.accounts.codes/files/login";
        }
      },
      success: (data) => {
        console.log("*data.length*", data, typeof data);
        if (data.length > 0) {
          this.setState({ data });
          var validFiles = data.filter(
            (file) => file.name && file.size && file.dateCreated
          );
          this.setState({ files: validFiles, next: true }, () => {
            console.log("files==" + this.state.files);
            history.push("/" + userName);
          });
        } else {
          this.setState({ next: true, data: "no-files" });
        }
      },
    });
  }

  render() {
    return (
      <Container fluid style={{ backgroundColor: "#EDEEF0" }}>
        <Router history={history}>
          <Switch>
            <Route exact path="/:userName">
              <Row>
                <Col>
                  {/* <User userName={userName} appName={"files"} /> */}
                </Col>
              </Row>
              {this.state.next && (
                <Files
                  history={history}
                  files={this.state.files}
                  data={this.state.data}
                  jwt={this.state.jwtFromCookie}
                  loadFiles={() => {
                    this.loadFiles();
                  }}
                />
              )}
            </Route>

            <Route exact path="/:userName/upload">
              <Upload
                history={history}
                jwt={this.state.jwtFromCookie}
                files={this.state.files}
                loadFiles={() => {
                  this.loadFiles();
                }}
              />
            </Route>
            <Route exact path="/:userName/trash">
              <Archiv
                history={history}
                jwt={this.state.jwtFromCookie}
                loadFiles={() => {
                  this.loadFiles();
                }}
              />
            </Route>
            <Route exact path="/:userName/test-trash">
              <Trash
                history={history}
                jwt={this.state.jwtFromCookie}
                loadFiles={() => {
                  this.loadFiles();
                }}
              />
            </Route>

            <ProtectedRoute
              path={"/admin/:userName"}
              // user={jwtFromCookie}//token?
              component={Home}
            />
            <Route>
              <Err history={history} />
            </Route>
          </Switch>
        </Router>
      </Container>
    );
  }
}

export default App;
//coment
