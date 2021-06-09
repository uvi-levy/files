import React, { Component } from "react";
import $ from "jquery";
import {
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Button,
  Form,
} from "react-bootstrap";

import Folder from "./assets/folder-solid.png";
import Note from "./assets/edit.svg";
import Print from "./assets/print.png";
import Copy from "./assets/copy.png";
import Delete from "./assets/delete.png";
import Move from "./assets/moveTo.png";
import Download from "./assets/download.png";
import Share from "./assets/share.png";
import Link from "./assets/link.png";
import LinkW from "./assets/linkWhite.png";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

let url = window.location;
let userName = url.pathname.split("/")[1];

const { Dialog } = require("@progress/kendo-react-dialogs");

export class Preview extends Component {
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
      file: {},
      visible: false,
      nextShare: false,
      sharedEmail:'',
      visibleGetLink: false,
      visibleDel: false,
      visibleNewFolder: false,
      notes: [],
    };
  }

  componentDidMount() {
    let { file } = this.props;
    console.log("pre**************", file);
    this.setState({ file });
  }

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
  toggleDeleteDialog=()=>{
    this.setState({
      visibleDel: !this.state.visibleDel,
    });
  }
  deleteFile=()=> {
    this.toggleDeleteDialog();
    console.log("in delete");
    const jwtFromCookie = this.props.jwt;
    const file = this.props.file;
    const fileId = file._id;
    console.log(fileId);

    $.ajax({
      type: "PUT",
      url:
        "https://files.codes/api/" +
        userName +
        "/multiFilesToArchiv",
      headers: { Authorization: this.props.jwt },
      data: JSON.stringify({ files: fileId }),
      dataType: "json",
      contentType: "application/json",

      success: () => {
        this.setState({ file: {} });
        // this.showPreFile();
        this.props.loadFiles();
        this.props.cleanPreView()
      },
      error: function (err) {
        alert("err");
      },
    });
  }
  moveTo=()=> {
    console.log("in moveTo");
    var file = this.props.file;
    console.log(JSON.stringify(file));
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
  download=() =>{
    console.log("in down:(");
    const file = this.props.file;
    const url = file.url;
    console.log(file.url);

    fetch(
      "https://files.codes/api/" +
        userName +
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
  printFile=()=> {
    console.log("in print");
    const file = this.props.file;
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
  saveNotes = (e) => {
    console.log("in saveNote");
    if (e.key == "Enter" || e == "save") {
      const file = this.props.file;
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
          //   this.showPreFile(data.data);
          this.textAreaNoteRef.current.value = "";
        },
      });
    }
  };

  editNote=(currentNote, file)=> {
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

  saveEditNote=(event, note, noteText, file)=> {
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
        url: "https://files.codes/api/" + userName + "/editNotes",
        headers: { Authorization: this.props.jwt },
        data: JSON.stringify({ notes: notes, fileId: fileId }),
        dataType: "json",
        contentType: "application/json",
        success: (data) => {
          console.log("save update! ", data);
            this.props.loadFiles();
          //   this.showPreFile(data.data);
        },
      });
    }
  }

  toggleGetLink=()=> {
    this.setState({
      visibleGetLink: !this.state.visibleGetLink,
    });
  }

  getLink=()=> {
    console.log("in getLink");
    var file = this.props.file;
    console.log(file.url);
    this.textAreaLinkRef.current.value = file.url;
    this.textAreaLinkRef.current.select();
    this.textAreaLinkRef.current.setSelectionRange(0, 99999);

    document.execCommand("copy");
  }
  copyFile=() =>{
    console.log("copy");
    const file = this.props.file;
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

  toggleDialog = () => {
    this.setState({
      visible: !this.state.visible,
      nextShare: false,
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
        this.setState({ nextShare: true ,sharedEmail: email });
      } else {
        console.log("not valid");
      }
      return false;
    };

    $("#eMailInput").on("keyup", validate);
  };
  shareFile = (permission) => {
    console.log("in shareFile");
    var file = this.props.file;
    if (!file) {
      alert("please check file");
    } else {
      var sharedEmail = this.state.sharedEmail;
      console.log(sharedEmail);
      if(!sharedEmail||sharedEmail==''){
        alert("Invalid email address")

      }
      else {
        console.log(permission);
        var fileId = file._id;
        this.setState({ visible: false });
        $.ajax({
          type: "POST",
          url:
            "https://api.dev.leader.codes/permissions/" +
            userName +
            "/createPermission",
          headers: { Authorization: this.props.jwt },
          data: JSON.stringify({
            applicationName: "files",
            sharedEmail: sharedEmail,
            objectId: fileId,
            permission: permission,
          }),
          contentType: "application/json",
          
          success: (data) => {
            console.log(data);
          
            alert("file shared succesfuly");
           
          },
          error:  (err)=> {
            console.log("error,try again later");
          },
        });
      }
    }
  };
  render() {
    const { file } = this.props;
    console.log(file);
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
          <Col md={10} style={{ color: "#363839", textAlign: "left" ,width: "90%" }}>
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
        <div
          style={{
            height: "150px",

            width: "100%",
            textAlign: "center",
            alignItems: "center",
            display: "flex",
            cursor: "pointer",
            backgroundColor: "#EFF0F2",
            borderRadius: "11px 11px 0 0",
            marginBottom: "0",
          }}
        >
          <img
            style={{
              display: "block",
              // width: "100%",
              // height: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
              margin: "auto",
            }}
            ref={this.imgRef}
            src={file.url}
          />
        </div>
      );
    } else {
      preFile = (
        <div style={{ maxHeight: "250px", width: "100%" }}>
          <iframe
            src={file.url}
            style={{ width: "50%", height: "50%" }}
            autoplay="0"
            autostart="0"
            allowfullscreen
            ref={this.imgRef}
            muted
          ></iframe>
        </div>
      );
    }
    return (
      <>
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
                      {this.props.file.url}
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
                      {this.props.file.name.split("__")[1]}
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
                
                </Form>
              </Container>
            </Dialog>
          )}
        </div>
        <OverlayScrollbarsComponent
                        options={{
                          overflowBehavior: {
                            x: "hidden",
                            y: "scroll",
                          },
                          scrollbars: {
                            visibility: "auto",
                            autoHide: "leave",
                            autoHideDelay: 400,
                          },
                          className: "os-theme-thin-dark",
                          paddingAbsolute: true,
                        }}
                      >
        <Container
          fluid
          style={{
            width: "95%",
            color: "#8181A5",
            width: "95%",
            height: "calc(90vh - 100px)",
         
            // display: "block",
            // overFlow: "scroll",
          }}
        >
          <Row style={{ textAlign: "center", marginTop: "0.5%" }}>
            <Col>{hoverButtonsActionViews}</Col>
          </Row>
          <hr />
          <Row className="justify-content-md-center">
            <Col
              style={{
                width: "98%",

                textAlign: "center",
              }}
            >
              {preFile}
            </Col>
          </Row>

          <div>
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
                  value={file.url}
                ></textarea>
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
              <Col md={5}>
                {" "}
                <p style={{ marginBottom: "0" }}>
                  Date Created{" "}
                  <p style={{ color: "#363839", display: "inline" }}>
                    {file.dateCreated.split("T")[0].substr(2)}
                  </p>
                </p>{" "}
              </Col>
              <Col md={5}>
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
          </div>
        </Container>
     </OverlayScrollbarsComponent>
      </>
    );
  }
}
