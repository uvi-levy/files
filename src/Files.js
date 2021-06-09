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
  CardDeck,
  Card,
  Breadcrumb,
  OverlayTrigger,
  Tooltip,
  Button,
  DropdownButton,
  Dropdown,
  ResponsiveEmbed,
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
import { Preview } from "./Preview";

const history = createBrowserHistory();

const { Dialog } = require("@progress/kendo-react-dialogs");

let url = window.location;
let userName = url.pathname.split("/")[1];

export class Files extends Component {
  constructor(props) {
    super(props);
    this.textAreaRef = React.createRef();
    this.textAreaFolderRef = React.createRef();

    this.state = {
      next: false,
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
      isPrevBtnActive: "disabled",
      isNextBtnActive: "",
      pageBound: 3,
      activePage: 4,
      selectedFile: {},
      files: [{}],
      grid: [],
      inFolder: true,
      foldersFiles: [],
      showBreadcrumb: false,
      folderName: "",
      visibleNewFolder: false,
      folders: [{}],
      showGrid: true,
      showList: false,
      view: [],
      filter: [{}],
      selectedfolder:'',
      visibleDel:false
    };

    this.showFiles = this.showFiles.bind(this);
    // this.loadSharedFiles = this.loadSharedFiles.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.btnDecrementClick = this.btnDecrementClick.bind(this);
    this.btnIncrementClick = this.btnIncrementClick.bind(this);
    this.btnNextClick = this.btnNextClick.bind(this);
    this.btnPrevClick = this.btnPrevClick.bind(this);
    this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
    this.findFile = this.findFile.bind(this);
    this.copyEmbed = this.copyEmbed.bind(this);
    this.exportEmbed = this.exportEmbed.bind(this);
    this.toggleNewFolder = this.toggleNewFolder.bind(this);
    this.newFolder = this.newFolder.bind(this);
  }

  componentDidMount() {
    console.log("in componentDidMount");

    var files = this.props.files;
    var data = this.props.data;
    console.log(data);
    if (data == "no-files") {
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
  loadFolders = () => {
    console.log("loadFolders");
    var myFolder = [];
    var data = this.props.data;
    if (typeof data === "object") {
      data.forEach((file) => {
        if (
          file.delete == false &&
          file.tags != "" &&
          file.tags != "null" &&
          file.tags
        ) {
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
  findFile(row, isSelect, checkBoxValue) {
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
        this.setState({ selectedFolder: row.name });
      }
    }
    console.log("checkBoxValue" + checkBoxValue);
    if (typeof checkBoxValue === "string") {
      if (checkBoxValue.includes("folder")) {
        console.log(checkBoxValue.split("/")[1]);
        this.findByTag(checkBoxValue.split("/")[1]);
        this.setState({ selectedFolder: checkBoxValue.split("/")[1] });
      }
    }

    files.forEach((file) => {
      if (row) {
        if (file._id == row.id) {
          console.log(file);

          if (isSelect) {
            this.showPreFile(file);

            this.setState({ selectedFile: file, showIcons: true }, () => {
              console.log(this.state.selectedFile);
            });
          }
        }
      }

      if (checkBoxValue) {
        if (file._id == checkBoxValue) {
          console.log(file);

          var card = $("#" + checkBoxValue);
          card.css("outline", "1px solid #8181A5 ");
          this.showPreFile(file);

          this.setState({ selectedFile: file, showIcons: true }, () => {});
        }
      }
    });

    if (isSelect == false) {
      this.setState({ showIcons: false });
    }
  }

  showPreFile = (file) => {
    if (file && file.name.split("__")[1] && file.dateCreated.split("T")[0]) {
      console.log("showPreFile", file);

      this.setState({
        filePreview: (
          <Preview
            file={file}
            jwt={this.props.jwt}
            findByTag={(folder)=>{this.findByTag(folder)}}
            cleanPreView={() => {
              this.setState({
                filePreview: (
                  <p style={{ margin: "0", color: "#75798E" }}>
                    no Preview Available
                  </p>
                ),
              });
            }}
            loadFiles={() => {
              this.props.loadFiles();
            }}
          />
        ),
      });
    } else {
      this.setState({
        filePreview: (
          <p style={{ margin: "0", color: "#75798E" }}>no Preview Available</p>
        ),
      });
    }
  };

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
            if (file.type.includes("image")) viewIcon = BigFile;
          } else {
            viewIcon = BigFile;
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
                  src={file.url}
                />
              </Card.Text>
            );
          } else {
            filePreview = (
              <Card.Text
                style={{
                  height: "130px",
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
                    maxHeight: "60%",
                    margin: "auto",
                  }}
                  src={viewIcon}
                />
              </Card.Text>
            );
          }

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
              className="gridCard"
              onClick={() => this.findFile(null, null, file._id)}
              style={{
                borderRadius: " 11px 11px 0px 0px",
                margin: "10% 7% 10% 7%",
                width: "100%",
                maxWidth: "100%",
                minWidth: "200px",
                height: "185px",
                overflow: "hidden",
                padding: "0",
              }}
            >
              <Card.Body
                style={{ padding: "0px", cursor: "pointer", marginBottom: "0" }}
              >
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
                    {file.name.split("__")[1].substr(0, 16)}
                  </p>
                </Card.Title>
                <Card.Text
                  className="cardTxt"
                  style={{ backgroundColor: "#EFF0F2", marginBottom: "0px" }}
                >
                  <Container fluid style={{ marginBottom: "0" }}>
                    <Row>
                      <Col style={{ padding: "0" }}>
                        <small style={{ fontSize: "70%", float: "left" }}>
                          {file.dateCreated.split("T")[0].substr(2)}
                        </small>
                      </Col>
                      <Col style={{ padding: "0" }}>
                        <small style={{ fontSize: "70%", float: "right" }}>
                          {(file.size * 1024).toPrecision(4).toString()} KB
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
        console.log(folders.length);
        var folderImg = <img src={Folder} />;
        if (folder.name && folder.date) {
          const row = {
            id: "folder " + folder.name,
            all: folderImg,
            name: folder.name,
            // team: user,
            date: folder.date.split("T")[0].substr(2),
            "file size": folder.size.toPrecision(4).toString() + " KB",
          };
          const gridCard = (
            <Card
              className="gridCard"
              onClick={() => this.findFile(null, null, "folder/" + folder.name)}
              style={{
                borderRadius: " 11px 11px 0px 0px",
                margin: "10% 7% 10% 7%",
                width: "100%",
                maxWidth: "100%",
                minWidth: "200px",
                height: "185px",
                overflow: "hidden",
                padding: "0",
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
                    width: "100%",
                    borderRadius: "11px 11px 0 0",
                    margin: "0",
                    backgroundColor: "#EFF0F2",
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
                <Card.Text
                  style={{ backgroundColor: "#EFF0F2", marginBottom: "0" }}
                >
                  <Container fluid>
                    <Row>
                      <Col style={{ padding: "0" }}>
                        {" "}
                        <small style={{ fontSize: "70%", float: "left" }}>
                          {folder.date.split("T")[0].substr(2)}
                        </small>
                      </Col>
                      <Col style={{ padding: "0" }}>
                        <small style={{ fontSize: "70%", float: "right" }}>
                          {folder.size.toPrecision(4).toString()} KB
                        </small>
                      </Col>
                    </Row>
                  </Container>
                </Card.Text>
              </Card.Body>
            </Card>
          );
          rows.push(row);
          grid.unshift(gridCard);
        }
      });
    }
    this.setState({ view: rows, grid: grid }, () => {
      console.log("^^^^^^^^" + this.state.view.length);
    });
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
    console.log(this.state.foldersFiles);
    // this.state.foldersFiles.forEach((file) => {
    //   if (file.tags.includes(folder)) {
    //     newFolder = false;
    //     console.log('folder already')
    //   }
    // });
    this.props.data.forEach((file) => {
      if (
        file.delete == false &&
        file.tags != "" &&
        file.tags != "null" &&
        file.tags &&
        file.tags.includes(folder)
      ) {
        newFolder = false;
        console.log("folder already");
      }
    });
    if (newFolder == true) {
      var myFile = new FormData();
      myFile.append("tags", folder);
      $.ajax({
        type: "POST",
        url:
          "https://files.codes/api/" +
          localStorage.getItem("userName") +
          "/createNewFolder",
        headers: { Authorization: this.props.jwt },
        data: myFile,
        processData: false,
        contentType: false,
        success: (data) => {
          alert("new folder created!");
          this.setState({ visibleNewFolder: false });
          console.log(data);
          this.props.loadFiles();
        },
        error: (err) => {
          alert("please try again later");
        },
      });
    } else {
      alert(
        `This folder: ${folder} - already exists, Use "move to" to transfer files to it`
      );
    }
  }

  findByTag = (folder) => {
    console.log("in findByTag");
    console.log(folder);
    this.setState({
      folderName: folder,
      filePreview: (
        <p style={{ margin: "0", color: "#75798E" }}>no Preview Available</p>
      ),
    });
    const jwtFromCookie = this.props.jwt;
    console.log(jwtFromCookie);
    $.ajax({
      type: "GET",
      url: "https://files.codes/api/" + userName + "/findByTag/" + folder,
      headers: { Authorization: this.props.jwt },
      success: (data) => {
        console.log(data);
        this.setState(
          {
            filter: data,
            inFolder: false,
            showBreadcrumb: true,
            currentPage: 1,
            noFiles: (
              <div style={{ height: "50%", width: "100%" }}>
                <NoFiles
                  goToUpload={() => {
                    this.props.history.push("/" + userName + "/upload");
                  }}
                />
              </div>
            ),
          },
          () => this.showFiles()
        );
      },
      error: (err) => {
        alert("please try again later");
      },
    });
  };
  toggleDeleteDialog=()=>{
    this.setState({
      visibleDel: !this.state.visibleDel,
    });
  }
  removeFolder = () => {
    this.toggleDeleteDialog()
    let folder = this.state.selectedFolder;
    console.log("remove Folder", folder);
    if (!folder) {
      alert("Folder cannot be deleted")
    } else {
      $.ajax({
        type: "POST",
        url: "https://files.codes/api/" + userName + "/removeFolder",
        headers: { Authorization: this.props.jwt },
        data:{folder},
        success: (data) => {
          console.log(data);
        this.props.loadFiles()
        this.setState({inFolder: true,
          showBreadcrumb: false,})
        },
        error: (err) => {
          alert("please try again later");
        },
      });
    }
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
          <Col
            md={3}
            sm={8}
            style={{
              borderRadius: "12px",
              marginLeft: "0",
              flex: "1",
              paddingLeft: "0.2%",
            }}
            key={index}
          >
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

    const { showGrid, showList } = this.state;

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
          if (a && b && a != null && b != null) {
            if (order === "asc") {
              return (
                Number(a.match(/(\d+)/g)[0]) - Number(b.match(/(\d+)/g)[0])
              );
            } else {
              return (
                Number(b.match(/(\d+)/g)[0]) - Number(a.match(/(\d+)/g)[0])
              );
            }
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
      onSizePerPageChange
    }) => (
      <DropdownButton drop="up" variant="outline-secondary" title='files per page'>
        {
          options.map((option) => {
            const isSelect = currSizePerPage === `${option.page}`;
            return (
              <Dropdown.Item
                key={ option.text }
                type="button"
                onClick={ () => onSizePerPageChange(option.page) }
                className={ `btn ${isSelect ? 'btn-secondary' : 'btn-warning'}` }
              >
                { option.text }
              </Dropdown.Item>
            );
          })
        }
      </DropdownButton>
    );

    const options = {
      pageButtonRenderer,
      sizePerPageRenderer,
    };
    const loader = this.state.noFiles;
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
                  <Col  style={{ margin: "0" }}>
                    {" "}
                    <h6 style={{ width: "100%" }}>
                      Are you sure you want to delete this folder with all its contents?
                    </h6>
                  </Col>
            
                </Row>
                <Row className="justify-content-md-center">
                  <Col style={{ margin: "4%" }} md={2}>
                    <Button
                      variant="primary"
                      style={{ borderRadius: "7px" }}
                      onClick={this.removeFolder}
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
                {/* {this.state.embedView && (
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
                )} */}
                <Container fluid>
                  <Row>
                    <Col
                      style={{
                        backgroundColor: "white",
                        borderRadius: "12px",

                        // height: "calc(100vh - 150px)",
                        // minHeight: "90%",
                      }}
                    >
                      <Row
                        style={{
                          borderRadius: "8px",
                          width: "100%",
                          marginBottom: "0",
                          alignItems: "center",
                          paddingLeft: "0",
                        }}
                      >
                        <Col sm={1} md={1} style={{ marginLeft: "0.2%" }}>
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
                        <Col sm={1} md={1}>
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

                        {this.state.showBreadcrumb && (
                          <>
                            <Col md={2}>
                              <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={
                                  <Tooltip>
                                    <span>delete folder</span>
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
                                  onClick={() => this.toggleDeleteDialog()}
                                  src={Delete}
                                />
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={
                                  <Tooltip>
                                    <span>change folder name</span>
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
                                  // onClick={() => ()}
                                  src={Move}
                                />
                              </OverlayTrigger>
                            </Col>
                            <Col>
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
                            </Col>
                          </>
                        )}
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
                          scrollbars: {
                            visibility: "auto",
                            autoHide: "leave",
                            autoHideDelay: 400,
                          },
                          className: "os-theme-thin-dark",
                          paddingAbsolute: true,
                        }}
                      >
                        <Col
                          id="gridView"
                          style={{
                            paddingRight: "6%",
                            paddingLeft: "0",
                            display: showGrid ? "block" : "none",
                            width: "100%",
                            height: "calc(90vh - 100px)",
                            // minHeight: "100%",
                          }}
                        >
                          <CardDeck
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: "100%",
                            }}
                          >
                            {renderCards}
                          </CardDeck>

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
                          scrollbars: {
                            visibility: "auto",
                            autoHide: "leave",
                            autoHideDelay: 400,
                          },
                          className: "os-theme-thin-dark",
                        }}
                      >
                        <Col
                          style={{
                            display: showList ? "block" : "none",
                            backgroundColor: "white",
                            height: "calc(90vh - 100px)",
                            minHeight: "90%",
                          }}
                        >
                          <BootstrapTable
                            selectRow={selectRow}
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
                          borderRadius: "12px",
                          backgroundColor: "#FFFFFF",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          // overFlow: "scroll",
                          height: "calc(90vh - 100px)",
                          minHeight: "100%",
                          maxWidth: "100%",
                        }}
                        onClick={() => {
                          console.log("resize");
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
