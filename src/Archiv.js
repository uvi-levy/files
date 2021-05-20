import React, { Component } from "react";

import $ from "jquery";
import { Navbar } from "./Navbar";
import { createBrowserHistory } from "history";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import {
  Card,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Button,
  ButtonGroup,
  Tooltip,
} from "react-bootstrap";

import "reactjs-popup/dist/index.css";
import Grid from "./assets/th-large-solid.png";
import List from "./assets/list-solid.png";
import File from "./assets/file-solid.png";
import Img from "./assets/image-regular.png";
import Adiuo from "./assets/headphones-solid.png";
import Video from "./assets/video-solid.png";
import User from "./assets/user-solid.png";
import Users from "./assets/user-friends-solid.png";
import FileCard from "./assets/Group.png";
import ThreePoints from "./assets/ellipsis-solid.png";
import Print from "./assets/print.png";
import Copy from "./assets/copy.png";
import Delete from "./assets/delete.png";
import Move from "./assets/arrow-right.png";
import ViewDetails from "./assets/arrow-view.png";
import Download from "./assets/download.png";
import Share from "./assets/share.png";
import ArrFilter from "./assets/sort-solid.svg";
import ArrDown from "./assets/angle-down-solid.svg";
import Embed from "./assets/Rectangle.png";
import Folder from "./assets/folder-solid.png";
import Arrow from "./assets/multimedia.png";
import Loader from "./assets/loader.gif";

const KEYS_TO_FILTERS = ["name"];
const { Dialog, DialogActionsBar } = require("@progress/kendo-react-dialogs");
const { SearchBar, ClearSearchButton } = Search;
const { ExportCSVButton } = CSVExport;

const history = createBrowserHistory();
let url = window.location;
let userName = url.pathname.split("/")[1];

export class Archiv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: [],
      copied: false,
      loadBar: false,
      row: {},
      todo: ["1", "2", "3", "4"],
      currentPage: 1,
      todosPerPage: 12,
      upperPageBound: 3,
      lowerPageBound: 0,
      isPrevBtnActive: "disabled",
      isNextBtnActive: "",
      pageBound: 3,
      visible: false,
      name: "",
      id: "",
      rowIndex: 0,
      activePage: 4,
      selectedFile: {},
      files: [{}],
      grid: [],
      search: "",
      showFolders: false,
      folderNum: "",
      allDisplay: "none",
      TeamDisplay: "none",
      checkDisplay: "none",
      showGrid: false,
      showList: true,
      view: [],
      filter: [{}],
      img: 0,
      all: 0,
      video: 0,
      adiuo: 0,
      file: 0,
    };

    this.showFiles = this.showFiles.bind(this);
    this.loadFiles = this.loadFiles.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.btnDecrementClick = this.btnDecrementClick.bind(this);
    this.btnIncrementClick = this.btnIncrementClick.bind(this);
    this.btnNextClick = this.btnNextClick.bind(this);
    this.btnPrevClick = this.btnPrevClick.bind(this);
    this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
    this.searchInGrid = this.searchInGrid.bind(this);
    this.goBack = this.goBack.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.recoveredFile = this.recoveredFile.bind(this);
  }

  componentDidMount() {
    console.log("in componentDidMount=archiv");

    this.loadFiles();
  }
  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id),
    });
  }
  setPrevAndNextBtnClass(listid) {
    let totalPage = Math.ceil(this.state.grid.length / this.state.todosPerPage);
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

  loadFiles() {
    console.log("load");
    const jwtFromCookie = this.props.jwt;
    console.log(jwtFromCookie);
    $.ajax({
      type: "GET",
      url: "https://files.codes/api/" + userName + "/showDeletedFiles",
      headers: { Authorization: jwtFromCookie },

      success: (data) => {
        // data = JSON.parse(data);
        console.log("**", data, data.length);
        if (data.length > 0) {
          console.log(data);
          const myFiles = [];
          data.forEach((file) => {
            if (
              file.name &&
              file.size &&
              file.dateCreated &&
              file.name.split(".")[1] &&
              file.name.split("__")[1]
            ) {
              myFiles.push(file);
            }
          });
          this.setState(
            { files: myFiles, filter: myFiles, loadBar: true },
            () => {
              this.showFiles();
              // this.filterFilesByType();
            }
          );
        }
      },
    });
  }

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
      this.loadFiles();
    }
    if (view == "newFolder") {
      this.setState({ visibleNewFolder: true });
    }
  };
  showFiles() {
    console.log("in showFiles");
    const files = this.state.filter;

    var iconsClasses = {
      ai: <img src={File} />,
      docx: <img src={File} />,
      pdf: <img src={File} />,
      xls: <img src={File} />,
      psd: <img src={File} />,
      pptx: <img src={File} />,
      png: <img src={Img} />,
      jpg: <img src={Img} />,
      mp3: <img src={Adiuo} />,
      mp4: <img src={Video} />,
    };

    if (files) {
      console.log(files);
      // let team = <img src={User}/>;
      const rows = [];
      const grid = [];
      const user = <img src={User} />;

      files.forEach((file) => {
        if (
          file.name &&
          file.dateCreated &&
          file.size &&
          file.name.split(".")[1] &&
          file.name.split("__")[1]
        ) {
          const actions = (
            <Button
              variant="light"
              onClick={() => this.toggleDialog(file.name, file._id)}
            >
              ❤
            </Button>
          );

          const row = {
            id: file._id,
            all: iconsClasses[file.name.split(".")[1].toLowerCase()],
            name: file.name.split("__")[1].substr(0, 16),
            team: user,
            date: file.dateCreated.split("T")[0],
            file: file.name.split(".")[1],
            "file size": file.size.toPrecision(4),
            recovered: actions,
          };
          const gridCard = (
            <Card
              id={file._id}
              className="gridCard"
              style={{
                borderRadius: " 11px 11px 0px 0px",
                margin: "12% 0% 12% 0%",
              }}
            >
              <Card.Body style={{ padding: "1%" }}>
                <Card.Img src={FileCard} />
                <Card.ImgOverlay>{actions}</Card.ImgOverlay>
                <Card.Title>
                  <p style={{ fontSize: "85%" }}>
                    {file.name.split("__")[1].substr(0, 13)}
                  </p>
                </Card.Title>
                <Card.Text style={{ backgroundColor: "#EFF0F2" }}>
                  <Container fluid>
                    <Row>
                      <Col md={7} style={{ padding: "0" }}>
                        <p style={{ fontSize: "70%", marginLeft: "0" }}>
                          Date of deletion{file.deleteToArchiv}
                        </p>
                      </Col>
                      <Col style={{ padding: "0" }}>
                        <p style={{ fontSize: "70%", float: "right" }}>
                          SIZE {(file.size * 1024).toPrecision(6).substr(0, 8)}{" "}
                          KB
                        </p>
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
      this.setState({ view: rows, grid: grid });
    } else console.log("no files");
  }

  searchInGrid(f) {
    console.log("in searchInGrid", f);
    const test = this.state.test;
    const newTest = [...test, f];
    console.log(newTest);
    // this.setState({test:newTest},console.log(this.state.test))
  }

  recoveredFile(fileId) {
    console.log("in recoveredFile");

    this.toggleDialog();

    const jwtFromCookie = this.props.jwt;

    console.log(fileId);

    $.ajax({
      type: "PUT",
      url: "https://files.codes/api/" + userName + "/recovereMultiFiles",
      headers: { Authorization: jwtFromCookie },
      data: JSON.stringify({ files: fileId }),
      dataType: "json",
      contentType: "application/json",

      success: (data) => {
        // data = JSON.parse(data);

        alert("file recovered!!");
        this.loadFiles();
        this.props.loadFiles();
      },
      error: function (err) {
        alert("err");
      },
    });
    //}
  }

  toggleDialog(name, id) {
    console.log("toggle");
    this.setState({
      visible: !this.state.visible,
      name,
      id,
    });
  }

  goBack() {
    console.log("in goBack");
    console.log(userName);
    this.props.history.push("/" + userName);
  }

  render() {
    const {
      grid,
      currentPage,
      todosPerPage,
      upperPageBound,
      lowerPageBound,
      isPrevBtnActive,
      isNextBtnActive,
    } = this.state;
    // const filteredgrid = files.filter(createFilter(this.state.search, KEYS_TO_FILTERS))
    // console.log(filteredgrid)

    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = grid.slice(indexOfFirstTodo, indexOfLastTodo);

    // if(filterGrid.length>0){console.log('123')}

    const renderTodos = currentTodos.map((todo, index) => {
      return (
        <Col md={2} style={{ borderRadius: "12px" }} key={index}>
          {todo}
        </Col>
      );
    });
    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(grid.length / todosPerPage); i++) {
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

    const MySearch = (props) => {
      let input;
      const handleClick = () => {
        props.onSearch(input.value);

        const files = this.state.files;
        const filterGrid = files.filter((file) =>
          file.name.includes(input.value)
        );
        // console.log(filterGrid)
        this.searchInGrid(filterGrid);
        // this.setState({search:input.value})
      };
      return (
        <input
          className="searchBar"
          placeholder="search"
          style={{
            border: "0.5px solid #BDBDC9",
            borderRadius: "4px",
            width: "100%",
            height: "40px",
            margin: "0",
          }}
          ref={(n) => (input = n)}
          type="text"
          onChange={handleClick}
          // delay='800ms'
        />
      );
    };

    const { showGrid } = this.state;
    const { showList } = this.state;
    const hoverCard = () => {
      return (
        <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
          <span>
            ALL <img style={{ width: "8%" }} src={ArrDown} />
          </span>
        </OverlayTrigger>
      );
    };

    // const hoverButtonsViews=[];
    const hoverButtons = [
      {
        text: " File ",
        value: "file",
        icon: File,
        color: "#FFF4AD",
        txtColor: "DarkRed",
      },
      {
        text: "Image",
        value: "img",
        icon: Img,
        color: "blue",
        txtColor: "DeepSkyBlue",
      },
      {
        text: "Adiuo",
        value: "adiuo",
        icon: Adiuo,
        color: "#DFD2FB",
        txtColor: "#6226EF",
      },
      {
        text: "Video",
        value: "video",
        icon: Video,
        color: "#FEB8EB",
        txtColor: "#E411AC",
      },
    ];
    const hoverButtonsViews = hoverButtons.map((button) => {
      return (
        <Button
          className="rounded-0 font-weight-bold"
          style={{
            backgroundColor: button.color,
            color: button.txtColor,
            borderStyle: "none",
            textAlign: "left",
          }}
          onClick={() => {
            this.filterFiles(button.value);
          }}
        >
          <img style={{ marginRight: "6%" }} src={button.icon} />
          {button.text}
        </Button>
      );
    });

    const popover = (
      <ButtonGroup
        style={{ display: this.state.allDisplay, opacity: "0.7", width: "10%" }}
        vertical
      >
        <div>{hoverButtonsViews}</div>
      </ButtonGroup>
    );

    const hoverCardTeam = () => {
      return (
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={popoverTeam}
        >
          <span>
            TEAM <img style={{ width: "8%" }} src={ArrDown} />
          </span>
        </OverlayTrigger>
      );
    };
    const hoverButtonsTeam = [
      {
        text: " Team ",
        value: "team",
        icon: Users,
        color: "CornflowerBlue",
        txtColor: "DarkCyan",
      },
      {
        text: "Manager",
        value: "manager",
        icon: User,
        color: "gray",
        txtColor: "DeepSkyBlue",
      },
    ];
    const hoverButtonsTeamsViews = hoverButtonsTeam.map((button) => {
      return (
        <Button
          className="rounded-0 font-weight-bold"
          style={{
            backgroundColor: button.color,
            color: button.txtColor,
            borderStyle: "none",
          }}
          onClick={() => {
            this.filterFilesByUser(button.value);
          }}
        >
          <img style={{}} src={button.icon} />
          {button.text}
        </Button>
      );
    });
    const popoverTeam = (
      <ButtonGroup
        style={{
          display: this.state.TeamDisplay,
          opacity: "0.7",
          width: "10%",
        }}
        vertical
      >
        <div>{hoverButtonsTeamsViews}</div>
      </ButtonGroup>
    );

    const name = (
      <span>
        NAME <img style={{ width: "3%" }} src={ArrFilter} />
      </span>
    );
    const date = (
      <span>
        DATE CREATED <img style={{ width: "3%" }} src={ArrFilter} />
      </span>
    );
    const file = (
      <span>
        FILE <img style={{ width: "6%" }} src={ArrFilter} />
      </span>
    );
    const size = (
      <span>
        FILE SIZE <img style={{ width: "6%" }} src={ArrFilter} />
      </span>
    );

    const actionFormatter = (row, cell, isSelect) => {
      if (row.isSelect) {
        return <div>123</div>;
      }
      return <div>456</div>;
    };

    const columns = [
      {
        dataField: "all",
        text: "ALL",
        sort: true,
        align: "center",
        headerClasses: "header-class",
        style: { width: "7%", direction: "ltr" },
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
        headerFormatter: hoverCard,
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
        headerFormatter: hoverCardTeam,
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
      },
      {
        dataField: "file size",
        text: size,
        align: "center",
        sort: true,
        headerClasses: "header-class",
        headerStyle: { fontSize: "90%" },
        style: { width: "7%" },
        headerAlign: "center",
      },
      {
        dataField: "recovered",
        text: "",
        align: "center",
        headerClasses: "header-class",
        headerStyle: { fontSize: "90%" },
        style: { width: "7%" },
        headerAlign: "center",
      },
    ];

    const checkpopover = (
      <ButtonGroup
        style={{ display: "block", opacity: "0.7", width: "10%" }}
        vertical
      >
        <div>
          <img
            style={{ margin: "5%" }}
            src={Delete}
            onClick={this.deleteFile}
          />
          <img style={{ margin: "5%" }} src={Copy} onClick={this.copyFile} />
        </div>
      </ButtonGroup>
    );
    const selectRow = {
      mode: "radio",
      clickToSelect: true,
      // onSelect:this.findFile,
      style: { backgroundColor: "#D4D4F5", color: "#9898B6" },

      selectionHeaderRenderer: ({ indeterminate, ...rest }) => (
        <div>
          <div style={{ display: "inline" }}>
            <input
              disabled
              type="checkbox"
              ref={(input) => {
                if (input) input.indeterminate = indeterminate;
              }}
              {...rest}
            />
          </div>
          <OverlayTrigger
            trigger="click"
            placement="top"
            overlay={checkpopover}
          >
            <button
              style={{
                borderStyle: "none",
                outline: "none",
                width: "25%",
                background: "none",
              }}
            >
              <img style={{ borderStyle: "none" }} src={ArrDown} />
            </button>
          </OverlayTrigger>
        </div>
      ),
      selectionRenderer: ({ mode, ...rest }) => <input type={mode} {...rest} />,
      selectColumnStyle: {
        width: "5%",
      },
    };

    const rowStyle = { zIndex: "90" };

    const rowEvents = {
      onClick: (e, row, rowIndex) => {
        console.log("row" + row + "ind" + rowIndex);
        console.log(row.id);
        this.setState({ row });
      },
    };

    const pageButtonRenderer = ({
      page,
      active,
      disable,
      title,
      onPageChange,
    }) => {
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

    const options = {
      pageButtonRenderer,
    };
    console.log(this.state.view);
    const tableStyle = { direction: "ltr" };

    const foldersVies = [];
    const folders = [];

    this.state.files.forEach((file) => {
      const folder = file.tags;

      if (folder != "" && folder != null && folder != undefined) {
        folders.push(folder);
      }
    });
    let stringArray = folders.map(JSON.stringify);
    let uniqueStringArray = new Set(stringArray);

    var foldersArr = [];

    uniqueStringArray.forEach((str) => {
      foldersArr.push(str);
    });

    foldersArr.forEach((folder) => {
      if (folder) {
        const clean = folder.replace(/^\["(.+)\"]$/, "$1");
        const button = (
          <button
            className="btn btn-outline-secondary"
            style={{ color: "gray", margin: "10px" }}
            onClick={() => this.findByTag(clean)}
          >
            <img style={{ marginRight: "10px" }} src={Folder} />
            {clean}
          </button>
        );

        foldersVies.push(button);
      }
    });
    const loader = (
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
    );

    const buttonsViews = [];
    const buttons = [
      { text: "All", value: "all", num: this.state.all },
      { text: "File", value: "file", icon: File, num: this.state.file },
      { text: "Image", value: "img", icon: Img, num: this.state.img },
      { text: "Adiuo", value: "adiuo", icon: Adiuo, num: this.state.adiuo },
      { text: "Video", value: "video", icon: Video, num: this.state.video },
    ];
    buttons.forEach((Button) => {
      const button = (
        <Col style={{ padding: "0", margin: "0.5%" }}>
          <button
            className="btn btn-outline-secondary"
            id={Button.value}
            style={{ fontSize: "75%", width: "100%", margin: "0" }}
            onClick={() => {
              this.filterFiles(Button.value);
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
      <div>
        {this.state.visible && (
          <Dialog height={230} width={580}>
            <Container>
              <Row>
                <Col md={1}>
                  <Button
                    variant="light"
                    style={{ color: "#8181A5" }}
                    onClick={this.toggleDialog}
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
                    {this.state.name}
                  </p>
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col style={{ margin: "4%" }} md={2}>
                  <Button
                    variant="primary"
                    style={{ borderRadius: "7px" }}
                    onClick={() => this.recoveredFile(this.state.id)}
                  >
                    Yes, I'm sure!
                  </Button>
                </Col>
              </Row>
            </Container>
          </Dialog>
        )}
        <Container fluid style={{ backgroundColor: "#EDEEF0" }}>
          <ToolkitProvider
            keyField="id"
            data={this.state.view}
            columns={columns}
            selectRow={selectRow}
            rowStyle={rowStyle}
            rowEvents={rowEvents}
            pagination={paginationFactory(options)}
            striped
            hover
            condensed
            // tabIndexCell
            search
            style={tableStyle}
          >
            {(props) => (
              <div>
                {this.state.loadBar && (
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
                <p
                  style={{
                    color: "#3A405E",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    fontSize: "18px",
                    margin: "1%",
                  }}
                  onClick={this.goBack}
                >
                  {" "}
                  👈back
                </p>
                <Container fluid>
                  <Row>
                    <Col
                      style={{ backgroundColor: "white", borderRadius: "8px" }}
                    >
                      <Row className="justify-content-md-center align-items-center">
                        <Col
                          md={4}
                          style={{
                            height: "60px",
                            backgroundColor: "#F6F6FA",
                            borderRadius: "8px",
                            margin: "3%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <p
                            style={{
                              fontWeight: "bold",
                              color: "#75798E",
                              margin: "0",
                            }}
                          >
                            Items In Trash Are Deleted Forever After 30 Days
                          </p>
                        </Col>
                      </Row>
                      <Row style={{marginLeft: "10%"}}>
                        {" "}
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
                      </Row>
                      <Col
                        style={{
                          padding: "0",
                          display: showGrid ? "block" : "none",
                        }}
                      >
                        <Row style={{ margin: "10%", marginTop: "0" }}>
                          {renderTodos}
                        </Row>
                        <Row className="justify-content-md-center">
                          {renderPrevBtn}
                          {pageDecrementBtn}

                          {renderPageNumbers}
                          {pageIncrementBtn}
                          {renderNextBtn}
                        </Row>
                      </Col>

                      <Col
                        style={{
                          display: showList ? "block" : "none",
                          backgroundColor: "white",
                          borderRadius: "8px",
                          justifyContent: "center",
                        }}
                      >
                        <Col
                          style={{
                            width: "80%",
                            margin: "10%",
                            marginTop: "3%",
                          }}
                        >
                          <BootstrapTable
                            selectRow={selectRow}
                            rowStyle={rowStyle}
                            rowEvents={rowEvents}
                            pagination={paginationFactory(options)}
                            noDataIndication={loader}
                            bordered={false}
                            striped
                            hover
                            condensed
                            search
                            {...props.baseProps}
                          />
                        </Col>
                      </Col>
                    </Col>
                  </Row>
                </Container>
              </div>
            )}
          </ToolkitProvider>
        </Container>
      </div>
    );
  }
}
