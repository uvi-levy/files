import React, { Component } from "react";
import "@progress/kendo-theme-default/dist/all.css";
import { createBrowserHistory } from "history";

import { Navbar } from "./Navbar";
import { NoFiles } from "./NoFiles";
import $ from "jquery";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import {
  Card,
  Breadcrumb,
  OverlayTrigger,
  Tooltip,
  Button,
  ButtonGroup,
  Form,
  ResponsiveEmbed,
  ProgressBar,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import ResizePanel, { typeOf } from "react-resize-panel";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import "reactjs-popup/dist/index.css";
import Grid from "./assets/th-large-solid.png";
import List from "./assets/list-solid.png";
import imgFile from "./assets/file-solid.png";
import Img from "./assets/image-regular.png";
import Adiuo from "./assets/headphones-solid.png";
import Video from "./assets/video-solid.png";
import SingleUser from "./assets/user-solid.png";
import FileCard from "./assets/Group.png";
import Print from "./assets/print.png";
import Copy from "./assets/copy.png";
import Delete from "./assets/delete.png";
import Move from "./assets/moveTo.png";
import Download from "./assets/download.png";
import Share from "./assets/share.png";
import Link from "./assets/link.png";
import LinkW from "./assets/linkWhite.png";
import BigFile from "./assets/big-file.png";
import BigAudio from "./assets/big-audio.png";
import BigVideo from "./assets/big-video.png";

import ArrFilter from "./assets/sort-solid.svg";
import Folder from "./assets/folder-solid.png";
import Note from "./assets/edit.svg";
import Loader from "./assets/loader.gif";

const history = createBrowserHistory();

const { Dialog } = require("@progress/kendo-react-dialogs");

let url = window.location;
let userName = url.pathname.split("/")[1];

export class Files extends Component {
  constructor(props) {
    super(props);
    this.textAreaRef = React.createRef();
    this.textAreaLinkRef = React.createRef();
    this.textAreaFolderRef = React.createRef();
    this.eMailInput = React.createRef();
    this.searchRef = React.createRef();
    this.imgRef = React.createRef();
    this.textAreaNoteRef = React.createRef();
    this.noteRef = React.createRef();

    this.state = {
      next: false,
      visible: false,
      copied: false,
      userName: "",
      embed: "",
      embedView: false,
      filePreview: (
        <p style={{ margin: "0", color: "#75798E" }}>no Preview Available</p>
      ),
      noFiles: (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            textAlign: "center",
          }}
        >
          <img src={Loader} />
        </div>
      ),
      currentPage: 1,
      cardsPerPage: 12,
      upperPageBound: 3,
      lowerPageBound: 0,
      link: "",
      load1: 0,
      load2: 0,
      isPrevBtnActive: "disabled",
      UploadCompleted: false,
      isNextBtnActive: "",
      nextShare: true,
      pageBound: 3,
      rowIndex: 0,
      activePage: 4,
      selectedFile: {},
      files: [{}],
      grid: [],
      home: true,
      search: "",
      folderNum: "",
      inFolder: true,
      allDisplay: "none",
      TeamDisplay: "none",
      foldersFiles: [],
      showBreadcrumb: false,
      folderName: "",
      visibleGetLink: false,
      visibleDel: false,
      visibleNewFolder: false,
      notes: [],
      folders: [{}],
      upload: false,
      showGrid: true,
      showList: false,
      view: [],
      filter: [{}],
      img: 0,
      all: 0,
      video: 0,
      adiuo: 0,
      file: 0,
    };

    this.showFiles = this.showFiles.bind(this);
    // this.loadSharedFiles = this.loadSharedFiles.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.btnDecrementClick = this.btnDecrementClick.bind(this);
    this.btnIncrementClick = this.btnIncrementClick.bind(this);
    this.btnNextClick = this.btnNextClick.bind(this);
    this.btnPrevClick = this.btnPrevClick.bind(this);
    this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.download = this.download.bind(this);
    this.shareFile = this.shareFile.bind(this);
    this.findFile = this.findFile.bind(this);
    this.copyFile = this.copyFile.bind(this);
    this.printFile = this.printFile.bind(this);
    this.findByTag = this.findByTag.bind(this);
    this.moveTo = this.moveTo.bind(this);
    this.copyEmbed = this.copyEmbed.bind(this);
    this.exportEmbed = this.exportEmbed.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.toggleGetLink = this.toggleGetLink.bind(this);
    this.getLink = this.getLink.bind(this);
    this.toggleDeleteDialog = this.toggleDeleteDialog.bind(this);
    this.toggleNewFolder = this.toggleNewFolder.bind(this);
    this.newFolder = this.newFolder.bind(this);
    this.showPreFile = this.showPreFile.bind(this);
    this.editNote = this.editNote.bind(this);
  }

  componentDidMount() {
    console.log("in componentDidMount");
    var files = this.props.files;
    var data = this.props.data;
    console.log(data);
    if (data == "no-files") {
      console.log("123456");
      this.setState({
        noFiles: (
          <div style={{ height: "50%", width: "100%" }}>
            <NoFiles
              goToUpload={() => {
                this.props.history.push("/" + userName + "/upload");
              }}
            />
          </div>
        ),
      });
    }
    this.setState({ files, filter: files, next: true }, () => {
      this.loadFolders();
      this.showFiles();
    });
  }
  componentDidUpdate() {
    console.log("in componentDidUpdate");
    if (this.props.files != this.state.files) {
      this.setState(
        { files: this.props.files, filter: this.props.files, next: true },
        () => {
          this.loadFolders();
          this.showFiles();
        }
      );
    }
  }
  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id),
    });
  }
  setPrevAndNextBtnClass(listid) {
    let totalPage = Math.ceil(this.state.grid.length / this.state.cardsPerPage);
    this.setState({ isNextBtnActive: "disabled" });
    this.setState({ isPrevBtnActive: "disabled" });
    if (totalPage === listid && totalPage > 1) {
      this.setState({ isPrevBtnActive: "" });
    } else if (listid === 1 && totalPage > 1) {
      this.setState({ isNextBtnActive: "" });
    } else if (totalPage > 1) {
      this.setState({ isNextBtnActive: "" });
      this.setState({ isPrevBtnActive: "" });
    }
  }
  btnIncrementClick() {
    this.setState({
      upperPageBound: this.state.upperPageBound + this.state.pageBound,
    });
    this.setState({
      lowerPageBound: this.state.lowerPageBound + this.state.pageBound,
    });
    let listid = this.state.upperPageBound + 1;
    this.setState({ currentPage: listid });
    this.setPrevAndNextBtnClass(listid);
  }
  btnDecrementClick() {
    this.setState({
      upperPageBound: this.state.upperPageBound - this.state.pageBound,
    });
    this.setState({
      lowerPageBound: this.state.lowerPageBound - this.state.pageBound,
    });
    let listid = this.state.upperPageBound - this.state.pageBound;
    this.setState({ currentPage: listid });
    this.setPrevAndNextBtnClass(listid);
  }
  btnPrevClick() {
    if ((this.state.currentPage - 1) % this.state.pageBound === 0) {
      this.setState({
        upperPageBound: this.state.upperPageBound - this.state.pageBound,
      });
      this.setState({
        lowerPageBound: this.state.lowerPageBound - this.state.pageBound,
      });
    }
    let listid = this.state.currentPage - 1;
    this.setState({ currentPage: listid });
    this.setPrevAndNextBtnClass(listid);
  }
  btnNextClick() {
    if (this.state.currentPage + 1 > this.state.upperPageBound) {
      this.setState({
        upperPageBound: this.state.upperPageBound + this.state.pageBound,
      });
      this.setState({
        lowerPageBound: this.state.lowerPageBound + this.state.pageBound,
      });
    }
    let listid = this.state.currentPage + 1;
    this.setState({ currentPage: listid });
    this.setPrevAndNextBtnClass(listid);
  }
  changeView = (view) => {
    if (view == "list") {
      this.setState({ showList: true, showGrid: false });
    }
    if (view == "grid") {
      this.setState({ showList: false, showGrid: true });
    }
    if (view == "trash") {
      this.props.history.push("/" + userName + "/trash");
    }
    if (view == "upload") {
      this.props.history.push("/" + userName + "/upload");
    }
    if (view == userName) {
      this.props.history.push("/" + userName);
    }
    if (view == "newFolder") {
      this.setState({ visibleNewFolder: true });
    }
    if (view == "noFiles") {
      this.setState({
        noFiles: (
          <div style={{ height: "50%", width: "100%" }}>
            <NoFiles
              goToUpload={() => {
                this.props.history.push("/" + userName + "/upload");
              }}
            />
          </div>
        ),
      });
    }
  };
  changeProps = (files, showFolder, history) => {
    console.log("filesChangeProps" + files);
    this.setState(
      {
        filter: files,
        inFolder: showFolder,
        showBreadcrumb: false,
        currentPage: 1,
      },
      () => {
        this.showFiles();
      }
    );
    this.props.history.push(history);
  };

  // loadSharedFiles() {
  //   console.log("loadSharedFiles");
  //   const jwtFromCookie = this.state.jwtFromCookie;
  //   $.ajax({
  //     type: "GET",
  //     url:
  //       "https://files.codes/api/" +
  //       localStorage.getItem("userName") +
  //       "/getSharedFiles",
  //     headers: { Authorization: jwtFromCookie },
  //     success: (data) => {
  //       console.log(data);

  //       var i;
  //       for (i = 0; i < data.length; i++) {
  //         if (
  //           data[i].name &&
  //           data[i].size &&
  //           data[i].dateCreated &&
  //           data[i].delete == false
  //         ) {
  //           this.setState((prevState) => ({
  //             files: [...prevState.files, data[i]],
  //             filter: [...prevState.filter, data[i]],
  //           }));
  //         }
  //         if (i == data.length - 1) {
  //           console.log("all files in view" + this.state.files.length);
  //           this.showFiles();
  //         }
  //       }

  //       this.filterFilesByType();
  //     },
  //     error: (err) => {
  //       alert("please try again later");
  //     },
  //   });
  // }

  // filterFilesByUser(user) {
  //   console.log("filter by user");
  //   const files = this.state.files;
  //   const uId = localStorage.getItem("uId");
  //   const userFile = files.filter((file) => file.uId == uId);
  //   const usersFile = files.filter((file) => file.uId != uId);
  //   if (user == "manager") {
  //     this.setState({ filter: userFile }, () => {
  //       this.showFiles();
  //     });
  //   }
  //   if (user == "team") {
  //     this.setState({ filter: usersFile }, () => {
  //       this.showFiles();
  //     });
  //   }
  // }

  findFile(row, isSelect, rowIndex, checkBoxValue) {
    console.log("in findFile " + isSelect);
    const selectedFile = this.state.selectedFile;
    const files = this.state.files;
    var fileUrl = "";
    var cards = $(".gridCard");
    cards.css("outline", "none ");

    if (row) {
      if (row.id.includes("folder")) {
        console.log(row.id);

        this.findByTag(row.name);
      }
    }
    console.log("checkBoxValue" + checkBoxValue);
    if (typeof checkBoxValue === "string") {
      if (checkBoxValue.includes("folder")) {
        console.log(checkBoxValue.split("/")[1]);
        this.findByTag(checkBoxValue.split("/")[1]);
      }
    }

    files.forEach((file) => {
      if (row) {
        if (file._id == row.id) {
          console.log(file);

          if (isSelect) {
            this.showPreFile(file);

            this.setState(
              { selectedFile: file, rowIndex, showIcons: true },
              () => {
                console.log(this.state.selectedFile);
              }
            );
          }
        }
      }

      if (checkBoxValue) {
        if (file._id == checkBoxValue) {
          console.log(file);

          var card = $("#" + checkBoxValue);
          card.css("outline", "1px solid #8181A5 ");
          this.showPreFile(file);

          this.setState(
            { selectedFile: file, rowIndex, showIcons: true },
            () => {}
          );
        }
      }
    });

    if (isSelect == false) {
      this.setState({ showIcons: false });
    }
  }

  showPreFile = (file) => {
    console.log("showPreFile", file);

    var preFile;
    var folderButton = (
      <button
        className="btn btn-outline-secondary folderBtn"
        style={{ color: "gray", border: "none" }}
      >
        <img src={Folder} /> /
      </button>
    );
    var p = $("p");
    p.attr("contenteditable", "false");
    p.css("border", "none ");

    if (file.tags != null && file.tags != "" && file.tags != []) {
      const folders = file.tags.split("/");
      console.log(folders);
      const folder = folders[folders.length - 1];
      console.log(folder);

      folderButton = (
        <button
          className="btn btn-outline-secondary folderBtn"
          style={{ color: "gray", border: "none" }}
          onClick={() => this.findByTag(folder)}
        >
          <img src={Folder} />
          {folder}
        </button>
      );
    }

    var notes = [];
    console.log(file.notes);
    file.notes.forEach((note, index) => {
      const fileNotes = (
        <Row key={index}>
          <Col md={10} style={{ color: "#363839", textAlign: "left" }}>
            <Row>
              <Col md={5}>
                <p
                  className="notes"
                  id={"note" + index}
                  onKeyDown={(e) => this.saveEditNote(e, note, note.note, file)}
                >
                  {note.note}
                </p>
              </Col>
              <Col md={3}>
                <p style={{ float: "right", fontSize: "75%" }}>{note.editor}</p>
              </Col>
              <Col md={5}>
                <p style={{ float: "right", fontSize: "70%" }}>{note.date}</p>
              </Col>
            </Row>

            <hr />
          </Col>
          <Col>
            <img
              onClick={() => this.editNote(note, file)}
              style={{ float: "right", cursor: "pointer" }}
              src={Note}
            />
          </Col>
        </Row>
      );
      notes.push(fileNotes);
      console.log("indexNotes" + index);
    });

    const sharedUsers = [];
    file.sharedUsers.forEach((mail) => {
      const share = (
        <div>
          <a href={"mailto:" + mail}>{mail}</a> <br />
        </div>
      );
      sharedUsers.push(share);
    });
    const hoverButtonsAction = [
      {
        text: "Delete",
        value: "delete",
        icon: Delete,
        border: "none",
        txtColor: "gray",
        fun: this.toggleDeleteDialog,
      },
      {
        text: "Duplication",
        value: "copy",
        icon: Copy,
        border: "groove  1px",
        txtColor: "DeepSkyBlue",
        fun: this.copyFile,
      },
      {
        text: "Move To",
        value: "move",
        icon: Move,
        border: "none",
        color: "purple",
        txtColor: "HotPink",
        fun: this.moveTo,
      },
      {
        text: "Download",
        value: "download",
        icon: Download,
        border: "none",
        txtColor: "gray",
        fun: this.download,
      },
      {
        text: "Print",
        value: "print",
        icon: Print,
        border: "groove  1px",
        txtColor: "gray",
        fun: this.printFile,
      },
      {
        text: "Share",
        value: "share",
        icon: Share,
        border: "none",
        txtColor: "gray",
        fun: this.toggleDialog,
      },
      {
        text: "Get Link",
        value: "link",
        icon: Link,
        border: "none",
        txtColor: "gray",
        fun: this.toggleGetLink,
      },

      // {text:"Embed",value:"embed",icon:Embed,border:'none',txtColor:'gray',fun:this.copyEmbed}
    ];
    const hoverButtonsActionViews = hoverButtonsAction.map((button) => {
      return (
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={
            <Tooltip>
              <span>{button.text}</span>
            </Tooltip>
          }
        >
          <img
            variant="light"
            style={{
              color: "#8181A5",
              backgroundColor: "#FFFFFF",
              cursor: "pointer",
              border: "none",
              textAlign: "left",
              padding: "10px",
            }}
            onClick={() => button.fun()}
            src={button.icon}
          />
        </OverlayTrigger>
      );
    });

    if (
      file.name.toLowerCase().split(".")[1] == "png" ||
      file.name.toLowerCase().split(".")[1] == "jpg" ||
      file.name.toLowerCase().split(".")[1] == "jpeg"
    ) {
      preFile = (
        <div style={{ width: "100%", height: "auto" }}>
          <img
            ref={this.imgRef}
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "90%",
              maxHeight: "90%",
              marginTop: "1%",
            }}
            src={file.url}
            onClick={this.full}
          />
        </div>
      );
    } else {
      preFile = (
        <div style={{ maxHeight: "250px" }}>
          <iframe
            src={file.url}
            style={{ width: "100vw", height: "56.25vw" }}
            autoplay="0"
            autostart="0"
            allowfullscreen
            ref={this.imgRef}
            muted
            autoplay
          ></iframe>
        </div>
      );
    }
    var fileUrl = (
      <OverlayScrollbarsComponent
        options={{
          overflowBehavior: {
            x: "hidden",
            y: "scroll",
          },
        }}
      >
        <Container
          fluid
          style={{
            color: "#8181A5",
            height: "calc(100vh - 150px)",
            minHeight: "100%",
          }}
        >
          <Row style={{ textAlign: "center", marginTop: "0.5%" }}>
            <Col>{hoverButtonsActionViews}</Col>
          </Row>
          <hr />
          <Row className="justify-content-md-center">
            <Col
              style={{
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              {preFile}
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col md={7}>
              <p style={{ fontWeight: "bold", margin: "4%" }}>
                {file.name.split("__")[1].substr(0, 15)}
              </p>
            </Col>
            <Col md={4}>{folderButton} </Col>
          </Row>
          <Row
            className="justify-content-md-center"
            style={{ marginTop: "1%" }}
          >
            <Col
              md={10}
              style={{
                marginRight: "0px",
                padding: "0",
                borderRadius: "8px 0 0 8px",
              }}
            >
              <textarea
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  backgroundColor: "#F6F6FA",
                  fontSize: "60%",
                  resize: "none",
                  float: "right",
                }}
                ref={this.textAreaLinkRef}
              >
                {file.url}
              </textarea>
            </Col>
            <Col style={{ padding: "0" }}>
              <Button
                variant="primary"
                onClick={this.getLink}
                style={{
                  borderRadius: "0 8px 8px 0 ",
                  float: "left",
                  margin: "0",
                }}
              >
                <img src={LinkW} />
              </Button>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col md={6}>
              {" "}
              <p style={{ marginBottom: "0" }}>
                Date Created{" "}
                <p style={{ color: "#363839", display: "inline" }}>
                  {file.dateCreated.split("T")[0]}
                </p>
              </p>{" "}
            </Col>
            <Col md={6}>
              {" "}
              <p style={{ float: "right", marginBottom: "1%" }}>
                Size{" "}
                <p style={{ color: "#363839", display: "inline" }}>
                  {" "}
                  {(file.size * 1024).toPrecision(4) + " KB"}
                </p>
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              {" "}
              <p>
                Shared With{" "}
                <p style={{ color: "#363839", display: "inline" }}>
                  {sharedUsers}
                </p>
              </p>
            </Col>
            <Col md={6}>
              {" "}
              <p style={{ float: "right" }}>
                Format{" "}
                <p style={{ color: "#363839", display: "inline" }}>
                  {file.name.toLowerCase().split(".")[1]}
                </p>
              </p>
            </Col>
          </Row>
          <Row className="justify-content-between">
            <Col>Notes</Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "center" }}>
              <hr />
              {notes}
              <Row>
                <Col style={{ position: "relative" }}>
                  <textarea
                    placeholder="Add your note here..."
                    ref={this.textAreaNoteRef}
                    style={{
                      width: "100%",
                      height: "100px",
                      resize: "none",
                      border: "none",
                      outline: "0.2px solid #8181A5",
                      display: "block",
                    }}
                    onKeyPress={(e) => {
                      this.saveNotes(e);
                    }}
                  />
                  <Button
                    onClick={() => this.saveNotes("save")}
                    style={{
                      color: "#8181A5",
                      padding: "0.5%",
                      float: "right",
                      position: "absolute",
                      bottom: "30%",
                      right: "5%",
                    }}
                    variant="outline-dark"
                  >
                    save +
                  </Button>
                  <hr />
                </Col>
              </Row>
              <Row>
                <Col></Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </OverlayScrollbarsComponent>
    );

    this.setState({ filePreview: fileUrl });
  };

  full = () => {
    console.log("in full");
    var elem = this.imgRef.current;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  };

  saveNotes = (e) => {
    console.log("in saveNote");
    if (e.key == "Enter" || e == "save") {
      const file = this.state.selectedFile;
      var note = this.textAreaNoteRef.current.value;
      var date = new Date();
      var dd = String(date.getDate()).padStart(2, "0");
      var mm = String(date.getMonth() + 1).padStart(2, "0");
      var yyyy = date.getFullYear();
      date = yyyy + "-" + mm + "-" + dd;
      console.log(date);
      var editor = file.userName;
      const fileId = file._id;
      let uId = localStorage.getItem("uId");
      console.log(note);
      console.log(fileId);
      $.ajax({
        type: "POST",
        url:
          "https://files.codes/api/" +
          localStorage.getItem("userName") +
          "/saveNotes",
        headers: { Authorization: this.props.jwt },
        data: JSON.stringify({
          notes: { note: note, date: date, editor: editor },
          fileId: fileId,
        }),
        dataType: "json",
        contentType: "application/json",
        success: (data) => {
          console.log("save note! ", data);
          this.props.loadFiles();
          this.showPreFile(data.data);
          this.textAreaNoteRef.current.value = "";
        },
      });
    }
  };

  editNote(currentNote, file) {
    console.log("editNote  " + currentNote.note);
    const notes = file.notes;
    console.log(notes);
    var index = notes.indexOf(currentNote);
    var id = "note" + index;
    console.log(id);
    var text = $("#" + id);
    text.attr("contenteditable", "true");
    text.css("border", "0.2px solid #8181A5 ");
    text.css("outline", "none ");

    console.log(text);
  }

  saveEditNote(event, note, noteText, file) {
    if (event.key === "Enter") {
      console.log("in saveEditNote", noteText);
      const notes = file.notes;
      const fileId = file._id;
      var index = notes.indexOf(note);
      var id = "note" + index;
      console.log(id);
      var text = $("#" + id);
      text.attr("contenteditable", "false");
      text.css("border", "none ");
      var newNote = text.text();
      console.log(newNote);
      if (newNote == "") {
        notes.splice(index, 1);
      } else {
        notes[index].note = newNote;
      }
      console.log(notes);

      $.ajax({
        type: "POST",
        url:
          "https://files.codes/api/" +
          localStorage.getItem("userName") +
          "/editNotes",
        headers: { Authorization: this.props.jwt },
        data: JSON.stringify({ notes: notes, fileId: fileId }),
        dataType: "json",
        contentType: "application/json",
        success: (data) => {
          console.log("save update! ", data);
          this.props.loadFiles();
          this.showPreFile(data.data);
        },
      });
    }
  }

  showFiles() {
    console.log("in showFiles");
    const files = this.state.filter;
    const folders = this.state.folders;

    var iconsClasses = {
      ai: <img src={imgFile} />,
      docx: <img src={imgFile} />,
      pdf: <img src={imgFile} />,
      xls: <img src={imgFile} />,
      psd: <img src={imgFile} />,
      pptx: <img src={imgFile} />,
      png: <img src={Img} />,
      jpg: <img src={Img} />,
      jpeg: <img src={Img} />,
      mp3: <img src={Adiuo} />,
      mp4: <img src={Video} />,
      gif: <img src={Img} />,
    };
    const rows = [];
    const grid = [];
    if (files) {
      var sortFilesByDate = files.slice().reverse();
      console.log(sortFilesByDate);

      const user = <img src={SingleUser} />;
      sortFilesByDate.forEach((file) => {
        if (
          file.name &&
          file.dateCreated &&
          file.size &&
          file.name.split(".")[1] &&
          file.name.split("__")[1]
        ) {
          let filePreview;
          let viewIcon;
          if (file.type) {
            if (file.type.includes("video")) viewIcon = BigVideo;
            if (file.type.includes("audio")) viewIcon = BigAudio;
            if (file.type.includes("pdf")) viewIcon = BigFile;
            if (file.type.includes("image")) viewIcon = BigFile
          }
          else{
            viewIcon = BigFile
          }

          if (
            file.name.toLowerCase().split(".")[1] == "png" ||
            file.name.toLowerCase().split(".")[1] == "jpg" ||
            file.name.toLowerCase().split(".")[1] == "jpeg" //replace file.type.includes("image")
          ) {
            filePreview = (
              <Card.Text
                style={{
                  height: "130px",
                  textAlign: "center",
                  alignItems: "center",
                  display: "flex",
                  cursor: "pointer",
                }}
              >
                <img
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    // maxWidth: "95%",
                    // maxHeight: "95%",
                    margin: "auto",
                  }}
                  src={file.url}
                />
              </Card.Text>
            );
          } else {
            filePreview = (
              <Card.Text
                style={{
                  height: "130px",
                  overflow: "hidden",
                  cursor: "not-allowed",
                }}
              >
                <img
                  style={{
                    // width: "95%",
                    height: "95%",
                    margin: "auto",
                    marginTop: "3%",
                  }}
                  src={viewIcon}
                />
              </Card.Text>
            );
          }
          console.log(file.size * 1024);
          const row = {
            id: file._id,
            all: iconsClasses[file.name.toLowerCase().split(".")[1]],
            name: file.name.split("__")[1].substr(0, 19),
            team: user,
            date: file.dateCreated.split("T")[0].substr(2),
            file: file.name.split(".")[1],
            "file size": (file.size * 1024).toPrecision(4) + " KB",
          };
          const gridCard = (
            <Card
              id={file._id}
              className="gridCard "
              onClick={() => this.findFile(null, null, null, file._id)}
              style={{
                borderRadius: " 11px 11px 0px 0px",
                margin: "7% 0% 7% 0%",
                width: "100%",
              }}
            >
              <Card.Body style={{ padding: "1%", cursor: "pointer" }}>
                {filePreview}
                <Card.Title
                  style={{
                    padding: "0",
                    textAlign: "left",
                    justifyContent: "center",
                    borderTop: "1px solid #EFF0F2",
                  }}
                >
                  <p
                    style={{
                      fontSize: "70%",
                      marginLeft: "1%",
                      display: "inline",
                    }}
                  >
                    {file.name.split("__")[1].substr(0, 30)}
                  </p>
                </Card.Title>
                <Card.Text
                  className="cardTxt"
                  style={{ backgroundColor: "#EFF0F2" }}
                >
                  <Container fluid>
                    <Row>
                      <Col style={{ padding: "0" }}>
                        <small style={{ fontSize: "70%", float: "left" }}>
                          {file.dateCreated.split("T")[0].substr(2)}
                        </small>
                      </Col>
                      <Col style={{ padding: "0" }}>
                        <small style={{ fontSize: "70%", float: "right" }}>
                          {(file.size * 1024).toPrecision(4)} KB
                        </small>
                      </Col>
                    </Row>
                  </Container>
                </Card.Text>
              </Card.Body>
            </Card>
          );

          rows.push(row);
          grid.push(gridCard);
        }
      });
    } else console.log("no files");
    if (folders && this.state.inFolder == true) {
      folders.forEach((folder) => {
        var folderImg = <img src={Folder} />;
        if (folder.name && folder.date) {
          const row = {
            id: "folder " + folder.name,
            all: folderImg,
            name: folder.name,
            // team: user,
            date: folder.date.split("T")[0].substr(2),
            "file size": folder.size.toPrecision(4) + " KB",
          };
          const gridCard = (
            <Card
              className="gridCard"
              onClick={() =>
                this.findFile(null, null, null, "folder/" + folder.name)
              }
              style={{
                borderRadius: " 11px 11px 0px 0px",
                margin: "7% 0% 7% 0%",
                width: "100%",
              }}
            >
              <Card.Body style={{ padding: "1%" }}>
                <Card.Text
                  style={{
                    height: "130px",
                    textAlign: "center",
                    alignItems: "center",
                    display: "flex",
                    cursor: "pointer",
                  }}
                >
                  <img
                    style={{
                      display: "block",

                      maxWidth: "95%",
                      maxHeight: "95%",
                      margin: "auto",
                    }}
                    src={FileCard}
                  />
                </Card.Text>
                <Card.Title>
                  <p style={{ fontSize: "85%" }}>{folder.name}</p>
                </Card.Title>
                <Card.Text style={{ backgroundColor: "#EFF0F2" }}>
                  <Container fluid>
                    <Row>
                      <Col>
                        {" "}
                        <small style={{ fontSize: "70%", float: "left" }}>
                          {folder.date.split("T")[0].substr(2)}
                        </small>
                      </Col>
                      <Col style={{ padding: "0" }}>
                        <small style={{ fontSize: "70%", float: "right" }}>
                          {folder.size.toPrecision(4)} KB
                        </small>
                      </Col>
                    </Row>
                  </Container>
                </Card.Text>
              </Card.Body>
            </Card>
          );
          rows.push(row);
          grid.push(gridCard);
        }
      });
    }
    this.setState({ view: rows, grid: grid }, () => {});
  }

  loadFolders = () => {
    console.log("loadFolders");
    var myFolder = [];
    var data = this.props.data;
    if (typeof data === "object") {
      data.forEach((file) => {
        if (file.tags != "" && file.tags != "null" && file.tags) {
          const folder = file.tags.split("/");

          folder.forEach((folder) => myFolder.push(folder));
        }
      });

      let stringArray = myFolder.map(JSON.stringify);
      let uniqueStringArray = new Set(stringArray);

      var foldersArr = [];
      var folders = [{}];

      uniqueStringArray.forEach((str) => {
        foldersArr.push(str);
      });
      foldersArr.forEach((folder) => {
        if (folder && !folder.includes("\\") && folder != '"undefined"') {
          const clean = folder.replace(/["']/g, "");
          const filteredFiles = data.filter(
            (file) =>
              file.tags != null && file.tags && file.tags.includes(clean)
          );
          var date = filteredFiles.reduce((r, o) =>
            o.datecreated < r.datecreated ? o : r
          );
          var size = 0;
          for (let index = 0; index < filteredFiles.length; index++) {
            size += filteredFiles[index].size * 1024;
          }
          var folder = { name: clean, size: size, date: date.dateCreated };

          folders.push(folder);
        }
      });

      this.setState({ folders }, () => {
        console.log(this.state.folders);

        this.showFiles();
      });
    }
  };

  toggleDeleteDialog() {
    this.setState({
      visibleDel: !this.state.visibleDel,
    });
  }
  deleteFile() {
    this.toggleDeleteDialog();
    console.log("in delete");
    const jwtFromCookie = this.props.jwt;
    const file = this.state.selectedFile;
    const fileId = file._id;
    console.log(fileId);

    $.ajax({
      type: "PUT",
      url:
        "https://files.codes/api/" +
        localStorage.getItem("userName") +
        "/multiFilesToArchiv",
      headers: { Authorization: this.props.jwt },
      data: JSON.stringify({ files: fileId }),
      dataType: "json",
      contentType: "application/json",

      success: () => {
        // alert("file delete!!");
        this.props.loadFiles();
      },
      error: function (err) {
        alert("err");
      },
    });
  }

  printFile() {
    console.log("in print");
    const file = this.state.selectedFile;
    var printWindow = window.open(
      file.url,
      "Print",
      "left=200",
      "top=200",
      "width=950",
      "height=500",
      "toolbar=0",
      "resizable=0"
    );
    printWindow.addEventListener(
      "load",
      function () {
        printWindow.print();
      },
      true
    );
  }
  copyEmbed() {
    console.log("in copyEmbed");
    const file = this.state.selectedFile;
    const embed = (
      <div id="embed" style={{ width: 660, height: "auto" }}>
        <ResponsiveEmbed aspectRatio="16by9">
          <iframe src={file.url} allowfullscreen="true" />
        </ResponsiveEmbed>
      </div>
    );
    this.setState({ embed, embedView: true });
  }
  exportEmbed() {
    var target = document.getElementById("embed").innerHTML;
    console.log(target, "@");

    this.textAreaRef.current.value = target;
    this.textAreaRef.current.select();
    this.textAreaRef.current.setSelectionRange(0, 99999);
    document.execCommand("copy");
    this.setState({ copied: true });
    // this.setCopySuccess('Copied!');
  }
  moveTo() {
    console.log("in moveTo");
    var file = this.state.selectedFile;
    console.log(JSON.stringify(file));
    let jwtFromCookie = this.props.jwt;
    var folder = prompt("Which folder do you want to move your file to?", "");
    if (folder == "") {
      alert("sorry, invalid folder name");
    } else if (folder) {
      $.ajax({
        type: "PUT",
        url:
          "https://files.codes/api/" +
          localStorage.getItem("userName") +
          "/moveTo",
        headers: { Authorization: this.props.jwt },
        data: JSON.stringify({ files: file, tag: folder }),
        dataType: "json",
        contentType: "application/json",

        success: () => {
          this.setState({ showBreadcrumb: false, folderName: "" });

          alert("files update!!");
          this.props.loadFiles();
        },
        error: (err) => {
          console.log(err);
          alert("ooooofff...err");
        },
      });
    }
  }

  copyFile() {
    console.log("copy");
    const file = this.state.selectedFile;
    let jwtFromCookie = this.props.jwt;
    let copyFile = {
      files: {
        files: {
          name: file.name,
          url: file.url,
          size: file.size * 1024 * 1024,
        },
      },
    };

    $.ajax({
      url:
        "https://files.codes/api/" +
        localStorage.getItem("userName") +
        "/savedMultiFilesDB",
      method: "POST",
      headers: { authorization: this.props.jwt },
      data: copyFile,
      success: (data) => {
        alert("The file was successfully duplicated");
        console.log("The file was successfully duplicated", data);
        this.props.loadFiles();
      },
    });
  }

  download() {
    console.log("in down:(");
    const jwtFromCookie = this.state.jwtFromCookie;
    const file = this.state.selectedFile;
    const url = file.url;
    console.log(file.url);

    fetch(
      "https://files.codes/api/" +
        localStorage.getItem("userName") +
        "/download/" +
        url,
      {
        method: "GET",
        headers: {
          Authorization: this.props.jwt,
        },
      }
    )
      .then((resp) => resp.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = file.name.split("__")[1];
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        alert("your file has downloaded!");
      })
      .catch(() => alert("oh no!"));
  }

  toggleDialog() {
    this.setState({
      visible: !this.state.visible,
      nextShare: false,
    });
  }

  toggleGetLink() {
    this.setState({
      visibleGetLink: !this.state.visibleGetLink,
    });
  }

  getLink() {
    console.log("in getLink");
    var file = this.state.selectedFile;
    console.log(file.url);
    this.textAreaLinkRef.current.value = file.url;
    this.textAreaLinkRef.current.select();
    this.textAreaLinkRef.current.setSelectionRange(0, 99999);

    document.execCommand("copy");
  }
  toggleNewFolder() {
    this.setState({
      visibleNewFolder: !this.state.visibleNewFolder,
    });
  }
  newFolder() {
    console.log("in newFolder");
    const folder = this.textAreaFolderRef.current.value;
    console.log(folder);
    var newFolder = true;
    this.state.foldersFiles.forEach((file) => {
      if (file.tags == folder) {
        newFolder = false;
      }
    });
    if (newFolder == true) {
      var myFile = new FormData();
      myFile.append("tags", folder);
      $.ajax({
        type: "POST",
        url:
          "https://files.codes/api/" +
          localStorage.getItem("uId") +
          "/createNewFolder",
        headers: { Authorization: this.props.jwt },
        data: myFile,
        processData: false,
        contentType: false,
        success: (data) => {
          alert("new folder created!");
          this.setState({ visibleNewFolder: false });
          console.log(data);
        },
        error: function (err) {
          alert("please try again later");
        },
      });
    } else {
      alert(
        `This folder: ${folder} - already exists, Use "move to" to transfer files to it`
      );
    }
  }

  shareFile(permission) {
    console.log("in shareFile");
    const jwtFromCookie = this.props.jwt;
    var file = this.state.selectedFile;
    if (!file) {
      alert("please check file");
    } else {
      var sharedEmail = this.eMailInput.current.value;
      console.log(sharedEmail);
      if ((sharedEmail, permission)) {
        console.log(permission);
        var fileId = file._id;

        $.ajax({
          type: "POST",
          url:
            "https://files.codes/api/" +
            localStorage.getItem("userName") +
            "/createPermission",
          headers: { Authorization: this.props.jwt },
          data: JSON.stringify({
            applicationName: "files",
            sharedEmail: sharedEmail,
            objectId: fileId,
            permission: permission,
          }),
          dataType: "json",
          contentType: "application/json",
          success: (data) => {
            console.log(data);
            $.ajax({
              type: "POST",
              url:
                "https://files.codes/api/" +
                localStorage.getItem("userName") +
                "/shareFile",
              headers: { Authorization: this.props.jwt },
              data: JSON.stringify({
                sharedEmail: sharedEmail,
                fileId: fileId,
              }),
              dataType: "json",
              contentType: "application/json",
            });
            alert("file shared succesfuly");
            this.setState({ visible: false });
          },
          error: function (err) {
            alert("error,try again later");
          },
        });
      }
    }
  }

  findByTag = (folder) => {
    console.log("in findByTag");
    console.log(folder);
    this.setState({ folderName: folder });
    const jwtFromCookie = this.props.jwt;
    console.log(jwtFromCookie);
    $.ajax({
      type: "GET",
      url:
        "https://files.codes/api/" +
        localStorage.getItem("userName") +
        "/findByTag/" +
        folder,
      headers: { Authorization: this.props.jwt },
      success: (data) => {
        console.log(data);
        this.setState(
          {
            filter: data,
            inFolder: false,
            showBreadcrumb: true,
            currentPage: 1,
          },
          () => this.showFiles()
        );
      },
      error: (err) => {
        alert("please try again later");
      },
    });
  };
  nextInShare = () => {
    console.log("nextInShare");
    const validateEmail = (email) => {
      const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };

    const validate = () => {
      const $result = $("#result");
      const email = $("#eMailInput").val();
      $result.text("");

      if (validateEmail(email)) {
        this.setState({ nextShare: true });
      } else {
        console.log("not valid");
      }
      return false;
    };

    $("#eMailInput").on("click", validate);
  };

  render() {
    const {
      grid,
      currentPage,
      cardsPerPage,
      upperPageBound,
      lowerPageBound,
      isPrevBtnActive,
      isNextBtnActive,
    } = this.state;

    var renderCards;

    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCard = grid.slice(indexOfFirstCard, indexOfLastCard);
    if (grid.length < 1) {
      renderCards = this.state.noFiles;
    } else {
      renderCards = currentCard.map((card, index) => {
        return (
          <Col md={3} sm={8} style={{ borderRadius: "12px" }} key={index}>
            {card}
          </Col>
        );
      });
    }

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(grid.length / cardsPerPage); i++) {
      pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map((number) => {
      if (number === 1 && currentPage === 1) {
        return (
          <button
            className="btn btn-outline-secondary active"
            onClick={this.handleClick}
            style={{ margin: "1%" }}
            key={number}
            id={number}
          >
            {number}
          </button>
        );
      } else if (number < upperPageBound + 1 && number > lowerPageBound) {
        return (
          <button
            className="btn btn-outline-secondary"
            style={{ margin: "1%" }}
            key={number}
            id={number}
            onClick={this.handleClick}
          >
            {number}
          </button>
        );
      }
    });
    let pageIncrementBtn = null;
    if (pageNumbers.length > upperPageBound) {
      pageIncrementBtn = (
        <button
          className="btn btn-outline-secondary"
          onClick={this.btnIncrementClick}
          style={{ margin: "1%" }}
        >
          &#8811;
        </button>
      );
    }
    let pageDecrementBtn = null;
    if (lowerPageBound >= 1) {
      pageDecrementBtn = (
        <button
          className="btn btn-outline-secondary"
          onClick={this.btnDecrementClick}
          style={{ margin: "1%" }}
        >
          &#8810;{" "}
        </button>
      );
    }
    let renderPrevBtn = null;
    if (isPrevBtnActive === "disabled") {
      renderPrevBtn = (
        <button
          disabled
          className={"btn btn-outline-secondary " + isPrevBtnActive}
          style={{ margin: "1%" }}
        >
          {" "}
          &#60;{" "}
        </button>
      );
    } else {
      renderPrevBtn = (
        <button
          className={"btn btn-outline-secondary " + isPrevBtnActive}
          onClick={this.btnPrevClick}
          style={{ margin: "1%" }}
        >
          &#60;
        </button>
      );
    }
    let renderNextBtn = null;
    if (isNextBtnActive === "disabled") {
      renderNextBtn = (
        <button
          disabled
          className={"btn btn-outline-secondary " + isNextBtnActive}
          style={{ margin: "1%" }}
        >
          <span id="btnNext">&#62; </span>
        </button>
      );
    } else {
      renderNextBtn = (
        <button
          className={"btn btn-outline-secondary  " + isNextBtnActive}
          onClick={this.btnNextClick}
          style={{ margin: "1%" }}
        >
          {" "}
          &#62;
        </button>
      );
    }

    const { showGrid, showList, upload } = this.state;

    const name = (
      <span>
        NAME <img style={{ height: "10px" }} src={ArrFilter} />
      </span>
    );
    const date = (
      <span>
        DATE CREATED <img style={{ height: "10px" }} src={ArrFilter} />
      </span>
    );
    const file = (
      <span>
        FILE <img style={{ height: "10px" }} src={ArrFilter} />
      </span>
    );
    const size = (
      <span>
        FILE SIZE <img style={{ height: "10px" }} src={ArrFilter} />
      </span>
    );
    const headerSortingStyle = { backgroundColor: "#D4D4F5" };

    const columns = [
      { dataField: "id", hidden: true, sort: true },
      {
        dataField: "all",
        text: "ALL",
        sort: true,
        align: "center",
        headerClasses: "header-class",
        style: { width: "4%", direction: "ltr" },
        headerStyle: { fontSize: "90%" },
        headerEvents: {
          onMouseEnter: (e, column, columnIndex) => {
            this.setState({ allDisplay: "block" });
          },
          onMouseLeave: (e, column, columnIndex) => {
            this.setState({ allDisplay: "none" });
          },
        },
        headerAlign: "center",
      },
      {
        dataField: "name",
        text: name,
        sort: true,
        headerAlign: "center",
        align: "center",
        headerStyle: { fontSize: "90%" },
        style: { width: "14%" },
        headerClasses: "header-class",
        headerSortingStyle,
      },
      {
        dataField: "date",
        text: date,
        align: "center",
        sort: true,
        style: { width: "14%" },
        headerAlign: "center",
        headerStyle: { fontSize: "90%" },
        headerClasses: "header-class",
        headerSortingStyle,
      },
      {
        dataField: "team",
        text: "ALL TEAM",
        align: "center",
        sort: true,
        headerClasses: "header-class",
        headerStyle: { fontSize: "90%" },
        style: { width: "7%" },
        headerAlign: "center",
        headerEvents: {
          onMouseEnter: (e, column, columnIndex) => {
            this.setState({ TeamDisplay: "block" });
          },
          onMouseLeave: (e, column, columnIndex) => {
            this.setState({ TeamDisplay: "none" });
          },
        },
        headerAlign: "center",
        headerSortingStyle,
      },
      {
        dataField: "file",
        text: file,
        sort: true,
        align: "center",
        headerClasses: "header-class",
        headerStyle: { fontSize: "90%" },
        style: { width: "7%" },
        headerAlign: "center",
        headerSortingStyle,
      },
      {
        dataField: "file size",
        text: size,
        align: "center",
        sort: true,
        sortFunc: (a, b, order) => {
          if (order === "asc") {
            return Number(a.match(/(\d+)/g)[0]) - Number(b.match(/(\d+)/g)[0]);
          } else {
            return Number(b.match(/(\d+)/g)[0]) - Number(a.match(/(\d+)/g)[0]);
          }
        },
        headerClasses: "header-class",
        headerStyle: { fontSize: "90%" },
        style: { width: "7%" },
        headerAlign: "center",
        headerSortingStyle,
      },
    ];

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];

    const selectRow = {
      mode: "radio",
      clickToSelect: true,
      onSelect: this.findFile,
      style: { backgroundColor: "#D4D4F5", color: "#9898B6" },

      selectionRenderer: ({ mode, ...rest }) => <input type={mode} {...rest} />,
      selectColumnStyle: {
        width: "2%",
        textAlign: "center",
      },
    };

    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        console.log(row);
        this.setState({ rowIndex });
      },
    };

    const pageButtonRenderer = ({ page, active, onPageChange }) => {
      const handleClick = (e) => {
        e.preventDefault();
        onPageChange(page);
      };
      const activeStyle = {};
      if (active) {
        activeStyle.backgroundColor = "gray";
        activeStyle.color = "white";
      } else {
        activeStyle.backgroundColor = "white";
        activeStyle.color = "black";
      }
      if (typeof page === "string") {
        activeStyle.backgroundColor = "white";
        activeStyle.color = "black";
      }
      return (
        <li className="page-item" style={{ padding: "1%" }}>
          <button
            className="btn btn-outline-secondary"
            onClick={handleClick}
            style={activeStyle}
          >
            {page}
          </button>
        </li>
      );
    };
    const sizePerPageRenderer = ({
      options,
      currSizePerPage,
      onSizePerPageChange,
    }) => (
      <div className="btn-group" role="group">
        {options.map((option) => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSizePerPageChange(option.page)}
              className={`btn ${isSelect ? "btn-secondary" : "btn-warning"}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    );

    const options = {
      pageButtonRenderer,
      sizePerPageRenderer,
    };
    const loader = this.state.noFiles;
    console.log(this.state.view.length);
    const tableStyle = { direction: "ltr" };

    return (
      <div
        style={{
          backgroundColor: "#EDEEF0",
          height: "99vh",
          overflow: "hidden",
        }}
      >
        <div>
          {this.state.visible && (
            <Dialog width={450}>
              <Container>
                <Row>
                  <Col>
                    <Button onClick={this.toggleDialog} variant="light">
                      X
                    </Button>
                  </Col>
                </Row>
                <Row
                  className="justify-content-md-center"
                  style={{ marginTop: "6%" }}
                >
                  <Col
                    md={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img style={{ marginLeft: "70%" }} src={Share} />
                  </Col>
                  <Col md={9} style={{ padding: "0" }}>
                    <h5>Share with people and groups</h5>
                  </Col>
                </Row>
                <Form>
                  <Form.Row className="justify-content-md-center">
                    <Col
                      md={10}
                      style={{
                        height: "40px",
                        backgroundColor: "#EFEFEF",
                        marginTop: "6%",
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                        borderBottom: "1px solid #5E81F4",
                      }}
                    >
                      <Form.Control
                        type="email"
                        autocomplete="on"
                        onKeyDown={(e) => this.nextInShare(e)}
                        placeholder="Add pepole and groups"
                        ref={this.eMailInput}
                        id="eMailInput"
                        style={{
                          backgroundColor: "#EFEFEF",
                          outline: "none",
                          border: "none",
                        }}
                      />
                    </Col>
                  </Form.Row>
                  {this.state.nextShare && (
                    <Form.Row style={{ padding: "5%", margin: "5%" }}>
                      <Col style={{ display: "flex", alignItems: "center" }}>
                        <h5
                          style={{
                            width: "50%",
                            marginRight: "0",
                            marginLeft: "35%",
                          }}
                        >
                          share:
                        </h5>
                      </Col>
                      <Col md={7} style={{ justifyContent: "space-between" }}>
                        <Button
                          style={{
                            backgroundColor: "#5E81F4",
                            color: "white",
                            margin: "3%",
                          }}
                          onClick={() => this.shareFile("public")}
                        >
                          public
                        </Button>
                        <Button
                          style={{
                            backgroundColor: "#5E81F4",
                            color: "white",
                            margin: "3%",
                          }}
                          onClick={() => this.shareFile("private")}
                        >
                          private
                        </Button>
                      </Col>
                    </Form.Row>
                  )}
                </Form>
              </Container>
            </Dialog>
          )}
        </div>

        <div>
          {this.state.visibleGetLink && (
            <Dialog height={150} width={550}>
              <Container>
                <Row>
                  <Col style={{ margin: "0", padding: "0" }} md={1}>
                    <Button
                      variant="light"
                      style={{ color: "#8181A5" }}
                      onClick={this.toggleGetLink}
                    >
                      X
                    </Button>
                  </Col>
                </Row>
                <Row
                  className="justify-content-start"
                  style={{ textAlign: "left" }}
                >
                  <Col
                    md={1}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <img src={Link} />
                  </Col>
                  <Col md={6} style={{}}>
                    {" "}
                    <h3>Get Link</h3>
                  </Col>
                </Row>
                <Row>
                  <Col md={8}>
                    <textarea
                      style={{
                        width: "100%",
                        border: "none",
                        backgroundColor: "#F6F6FA",
                        fontSize: "90%",
                        resize: "none",
                      }}
                      ref={this.textAreaLinkRef}
                    >
                      {this.state.selectedFile.url}
                    </textarea>
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="primary"
                      style={{ borderRadius: "7px" }}
                      onClick={this.getLink}
                    >
                      copy link
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Dialog>
          )}
          {this.state.visibleDel && (
            <Dialog height={230} width={580}>
              <Container>
                <Row>
                  <Col md={1}>
                    <Button
                      variant="light"
                      style={{ color: "#8181A5" }}
                      onClick={this.toggleDeleteDialog}
                    >
                      X
                    </Button>
                  </Col>
                </Row>
                <Row
                  className="justify-content-start"
                  style={{ textAlign: "left", margin: "2%" }}
                >
                  <Col md={8} style={{ margin: "0" }}>
                    {" "}
                    <h6 style={{ width: "100%" }}>
                      Are you sure you want to delete this file?
                    </h6>
                  </Col>
                  <Col md={3}>
                    <p
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        backgroundColor: "#F6F6FA",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0",
                      }}
                    >
                      {this.state.selectedFile.name.split("__")[1]}
                    </p>
                  </Col>
                </Row>
                <Row className="justify-content-md-center">
                  <Col style={{ margin: "4%" }} md={2}>
                    <Button
                      variant="primary"
                      style={{ borderRadius: "7px" }}
                      onClick={this.deleteFile}
                    >
                      Yes, I'm sure!
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Dialog>
          )}
          {this.state.visibleNewFolder && (
            <Dialog height={150} width={550}>
              <Container>
                <Row>
                  <Col style={{ margin: "0", padding: "0" }} md={1}>
                    <Button
                      variant="light"
                      style={{ color: "#8181A5" }}
                      onClick={this.toggleNewFolder}
                    >
                      X
                    </Button>
                  </Col>
                </Row>
                <Row
                  className="justify-content-start"
                  style={{ textAlign: "left" }}
                >
                  <Col
                    md={1}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <img src={Link} />
                  </Col>
                  <Col md={6} style={{}}>
                    {" "}
                    <h3>New Folder</h3>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <textarea
                      style={{
                        width: "100%",
                        border: "none",
                        backgroundColor: "#F6F6FA",
                        fontSize: "90%",
                        resize: "none",
                      }}
                      placeholder="Folder name"
                      ref={this.textAreaFolderRef}
                    ></textarea>
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="light"
                      style={{ borderRadius: "7px" }}
                      onClick={this.toggleNewFolder}
                    >
                      cancel
                    </Button>
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="primary"
                      style={{ borderRadius: "7px" }}
                      onClick={this.newFolder}
                    >
                      create
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Dialog>
          )}
        </div>
        <div>
          <ToolkitProvider
            keyField="id"
            data={this.state.view}
            columns={columns}
            selectRow={selectRow}
            rowEvents={rowEvents}
            pagination={paginationFactory(options)}
            striped
            hover
            condensed
            search
            style={tableStyle}
            defaultSorted={defaultSorted}
          >
            {(props) => (
              <div style={{ marginTop: "1%" }}>
                {this.state.next && (
                  <Navbar
                    files={this.state.files}
                    folders={this.state.folders}
                    changeProps={(val, fol, history) => {
                      this.changeProps(val, fol, history);
                    }}
                    history={history}
                    changeView={(view) => {
                      this.changeView(view);
                    }}
                  />
                )}
                {this.state.embedView && (
                  <div>
                    {" "}
                    {this.state.embed}
                    <Button
                      style={{ margin: "4px" }}
                      variant="warning"
                      onClick={this.exportEmbed}
                    >
                      copy the file Inside a iFrame tag{" "}
                    </Button>
                    <div className="container">
                      <div className="row">
                        <div className="col">
                          {this.state.copied && (
                            <span style={{ color: "#B8860B" }}>copied!</span>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col ">
                          <textarea
                            className="bubble"
                            style={{ width: "100%" }}
                            ref={this.textAreaRef}
                          />
                          <Button
                            style={{ float: "right" }}
                            variant="dark"
                            onClick={() =>
                              this.setState({ embedView: false, copied: false })
                            }
                          >
                            x
                          </Button>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col"> </div>
                      </div>
                    </div>
                  </div>
                )}
                <Container fluid>
                  <Row style={{ backgroundColor: "white" }}>
                    <Col
                      style={{
                        backgroundColor: "white",
                        borderRadius: "12px 0 0 12px",

                        // height: "calc(100vh - 150px)",
                        // minHeight: "90%",
                      }}
                    >
                      <Row
                        style={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          width: "100%",
                          marginBottom: "0",
                          alignItems: "center",
                        }}
                      >
                        <Col sm={0.5} md={0.5} style={{ marginLeft: "0.5%" }}>
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={
                              <Tooltip>
                                <span>Grid</span>
                              </Tooltip>
                            }
                          >
                            <Button
                              variant="outline-light"
                              className="showFiles"
                              onClick={() => this.changeView("grid")}
                            >
                              <img style={{ height: "80%" }} src={Grid} />
                            </Button>
                          </OverlayTrigger>
                        </Col>
                        <Col sm={0.5} md={0.5}>
                          <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={
                              <Tooltip>
                                <span>List</span>
                              </Tooltip>
                            }
                          >
                            <Button
                              variant="outline-light"
                              className=" showFiles"
                              onClick={() => this.changeView("list")}
                            >
                              <img style={{ height: "80%" }} src={List} />
                            </Button>
                          </OverlayTrigger>
                        </Col>
                        <Col style={{ height: "50px" }}></Col>
                        <Col>
                          {this.state.showBreadcrumb && (
                            <Breadcrumb>
                              <Breadcrumb.Item
                                onClick={() => {
                                  this.setState(
                                    {
                                      filter: [{}],
                                      inFolder: true,
                                      currentPage: 1,
                                    },
                                    () => {
                                      this.showFiles();
                                    }
                                  );
                                }}
                              >
                                Folders
                              </Breadcrumb.Item>
                              <Breadcrumb.Item activ>
                                {this.state.folderName}
                              </Breadcrumb.Item>
                            </Breadcrumb>
                          )}
                        </Col>
                      </Row>
                      <Row
                        style={{ height: "1px", backgroundColor: "#E8EAEC" }}
                      ></Row>
                      <OverlayScrollbarsComponent
                        options={{
                          overflowBehavior: {
                            x: "hidden",
                            y: "scroll",
                          },
                        }}
                      >
                        <Col
                          id="gridView"
                          style={{
                            padding: "0",
                            display: showGrid ? "block" : "none",
                            backgroundColor: "white",
                            width: "100%",
                            // overflowY: "scroll",
                            // overflowX: "hidden",
                            height: "calc(100vh - 150px)",
                            minHeight: "100%",
                          }}
                        >
                          <Row
                            style={{
                              margin: "1%",
                              marginTop: "0",
                              textAlign: "center",
                            }}
                          >
                            {renderCards}
                          </Row>
                          <Row className="justify-content-md-center">
                            {renderPrevBtn}
                            {pageDecrementBtn}

                            {renderPageNumbers}
                            {pageIncrementBtn}
                            {renderNextBtn}
                          </Row>
                        </Col>
                      </OverlayScrollbarsComponent>
                      <OverlayScrollbarsComponent
                        options={{
                          overflowBehavior: {
                            x: "hidden",
                            y: "scroll",
                          },
                        }}
                      >
                        <Col
                          style={{
                            display: showList ? "block" : "none",
                            backgroundColor: "white",
                            height: "calc(100vh - 150px)",
                            minHeight: "90%",
                          }}
                        >
                          <BootstrapTable
                            selectRow={selectRow}
                            rowEvents={rowEvents}
                            pagination={paginationFactory(options)}
                            noDataIndication={loader}
                            bordered={false}
                            striped
                            hover
                            condensed
                            search
                            defaultSorted={defaultSorted}
                            {...props.baseProps}
                          />
                        </Col>
                      </OverlayScrollbarsComponent>
                    </Col>

                    <ResizePanel
                      direction="w"
                      style={{ width: "30%", marginLeft: "0.5%" }}
                    >
                      <Col
                        id="prevFile"
                        style={{
                          borderRadius: "0 12px 12px 0",
                          backgroundColor: "#FFFFFF",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          overflowY: "hidden",
                          overflowX: "hidden",
                          height: "calc(100vh - 150px)",
                          minHeight: "100%",
                        }}
                      >
                        {this.state.filePreview}
                      </Col>
                    </ResizePanel>
                  </Row>
                </Container>
              </div>
            )}
          </ToolkitProvider>
        </div>
      </div>
    );
  }
}
