import React, { Component } from "react";
import $ from "jquery";
import { createBrowserHistory } from "history";

import { Container, Row, Col, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Chart } from "./Chart";

import Grid from "./assets/th-large-solid.png";
import List from "./assets/list-solid.png";
import Arrow from "./assets/fileUp.png";
import FileG from "./assets/file.png";
import ImgG from "./assets/img.png";
import AdiuoG from "./assets/audio.png";
import VideoG from "./assets/video.png";
import FolderG from "./assets/folder.png";
import Trash from "./assets/trash.png";

const history = createBrowserHistory();

let url = window.location;
let userName = url.pathname.split("/")[1];

export class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { filteredFilesByType: [] };
    this.searchRef = React.createRef();
  }

  componentDidMount() {
    const files = this.props.files;
    this.setState({ files }, () => {
      this.filteredFilesByType(this.state.files);
    });
  }
  componentDidUpdate() {
    console.log("innnnn");
    if (this.props.files != this.state.files) {
      this.setState({ files: this.props.files });
    }
  }
  filteredFilesByType = (files) => {
    console.log("filteredFilesByType NavBar " + JSON.stringify(files));
    if (files) {
      const img = {
        img: files.filter((file) => file.type && file.type.includes("image")),
      };
      const audio = {
        audio: files.filter((file) => file.type && file.type.includes("audio")),
      };
      const video = {
        video: files.filter((file) => file.type && file.type.includes("video")),
      };
      const others = {
        others: files.filter((file) => file.type && file.type.includes("pdf")),
      };
      var filteredFilesByType = [img, audio, video, others];
      this.setState({ filteredFilesByType }, () => {
        console.log(this.state.filteredFilesByType);
      });
    }
  };
  filteredFiles(type) {
    const files = this.state.files;
    console.log("in filterFiles");
    let filtaredFiles = [];
    this.props.changeView(userName);

    if (files && files.length) {
      if (type == "folder") {
        this.props.changeProps([], true);
      }
      if (type == "search") {
        console.log("in searchInFiles");
        const value = this.searchRef.current.value;
        console.log(value);
        var result = [];
        files.forEach((file) => {
          if (file.name.toLowerCase().includes(value)) {
            result.push(file);
          }
        });

        this.props.changeProps(result, false);
      }
      if (type == "img") {
        filtaredFiles = this.state.filteredFilesByType[0].img;

        console.log("img" + filtaredFiles);
        this.props.changeProps(filtaredFiles, false);
      }
      if (type == "audio") {
        filtaredFiles = this.state.filteredFilesByType[1].audio;
        console.log(filtaredFiles, false);

        this.props.changeProps(filtaredFiles);
      }
      if (type == "video") {
        filtaredFiles = this.state.filteredFilesByType[2].video;
        console.log(filtaredFiles);

        this.props.changeProps(filtaredFiles, false);
      }
      if (type == "file") {
        filtaredFiles = this.state.filteredFilesByType[3].others;
        console.log(filtaredFiles);

        this.props.changeProps(filtaredFiles, false);
      }

      if (type == "all") {
        this.props.changeProps(files, true);
        this.props.changeView(userName);
      }
    }
    if (filtaredFiles.length < 1) {
      console.log("no files");
      this.props.changeView("noFiles");
    }
    if (type == "trash") {
      console.log("trash");
      this.props.changeView("trash");
    }
  }

  render() {
    var filteredFilesByType = this.state.filteredFilesByType;
    var { folders, all, doc, img, video, audio } = 0;
    if (filteredFilesByType.length) {
      doc = this.state.filteredFilesByType[3].others.length;
      img = this.state.filteredFilesByType[0].img.length;
      video = this.state.filteredFilesByType[2].video.length;
      audio = this.state.filteredFilesByType[1].audio.length;
      all = doc + img + video + audio;
    }

    if (this.props.folders) folders = this.props.folders.length;
    const buttonsViews = [];
    const buttons = [
      { text: "All", value: "all", num: all },
      {
        text: "Folder",
        value: "folder",
        icon: FolderG,
        num: folders,
      },
      {
        text: "Document",
        value: "file",
        icon: FileG,
        num: doc,
      },
      {
        text: "Image",
        value: "img",
        icon: ImgG,
        num: img,
      },
      {
        text: "Adiuo",
        value: "audio",
        icon: AdiuoG,
        num: audio,
      },
      {
        text: "Video",
        value: "video",
        icon: VideoG,
        num:  video,
      },
      {
        text: "Trash",
        value: "trash",
        icon: Trash,
       
      },
    ];
    buttons.forEach((Button) => {
      if(Button.num) Button.num=Button.num.toString()
    
      const button = (
        <Col style={{ padding: "0", margin: "0.5%" }}>
          <button
            className="btn btn-outline-secondary"
            id={Button.value}
            style={{
              fontSize: "70%",
              width: "100%",
              margin: "0",
              height: "35px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            onClick={() => {
              this.filteredFiles(Button.value);
            }}
          >
            <img style={{ marginRight: "5%" }} src={Button.icon} />
            {Button.text} {Button.num}
          </button>
        </Col>
      );
     
      buttonsViews.push(button);
    });

    return (
      <>
        <Container
          className="align-items-center"
          fluid
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            marginBottom: "0.5%",
          }}
        >
          <Row style={{ height: "90px" }} className="align-items-center">
            <Col style={{ marginLeft: "0.2%" }} sm={2} md={2}>
              <input
                type="text"
                className="searchBar"
                placeholder="search"
                style={{
                  border: "0.5px solid #BDBDC9",
                  borderRadius: "4px",
                  width: "100%",
                  height: "35px",
                  margin: "0",
                }}
                ref={this.searchRef}
                onChange={() => this.filteredFiles("search")}
              />
            </Col>

            <Col style={{ marginLeft: "6%" }} sm={7} md={7}>
              <Row className="justify-content-md-flex-end ">
                {" "}
               <Col><Chart /></Col> 
                {buttonsViews}
              </Row>
            </Col>
            <Col sm={2} md={2} style={{ textAlign: "end" }}>
              <button
                className="btn btn-primary font-weight-bold"
                onClick={() => {
                  this.props.changeView("upload");
                }}
                style={{
                  backgroundColor: "#5E81F4",
                  height: "35px",
                  width: "50%",
                }}
              >
                <p>
                  UPLOAD <img src={Arrow} />
                </p>{" "}
              </button>
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Tooltip>
                    <span>create new folder</span>
                  </Tooltip>
                }
              >
                <button
                  className="btn btn-outline-primary newFolder"
                  style={{
                    width: "15%",
                    height: "35px",
                    marginLeft: "3%",
                  }}
                  onClick={() => this.props.changeView("newFolder")}
                ></button>
              </OverlayTrigger>
              {/* </div> */}
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
