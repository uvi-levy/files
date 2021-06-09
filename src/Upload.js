import React, { Component } from "react";
import imageCompression from "browser-image-compression";
import { Navbar } from "./Navbar";
import { createBrowserHistory } from "history";

import uploadImg from "./assets/upload.png";
import File from "./assets/file-solid.png";
import Img from "./assets/image-regular.png";
import Adiuo from "./assets/headphones-solid.png";
import Video from "./assets/video-solid.png";
import {
  Container,
  Row,
  Col,
  Dropdown,
  Button,
  ProgressBar,
} from "react-bootstrap";

import Folder from "./assets/folder-solid.png";
import BootstrapTable from "react-bootstrap-table-next";
import myfolder from "./Folders";
import $ from "jquery";
import Folders from "./Folders";
import CreatableAdvanced from "./Folders";
// import {Progressbar} from './Loader'
const history = createBrowserHistory();

window.$ = $;
// import Adiuo from "./assets/headphones-solid.png";
let url = window.location;
let userName = url.pathname.split("/")[1];
console.log(userName);
localStorage.setItem("userName", userName);
let uId = localStorage.getItem("uId");

var iconsClasses = {
  ai: <img src={File} />,
  docx: <img src={File} />,
  pdf: <img src={File} />,
  xls: <img src={File} />,
  psd: <img src={File} />,
  pptx: <img src={File} />,
  png: <img src={Img} />,
  jpg: <img src={Img} />,
  jpeg: <img src={Img} />,
  mp3: <img src={Adiuo} />,
  mp4: <img src={Video} />,
};
export class Upload extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {
      uId: "",
      userName: "",
      loadBar: false,
      loader: false,
      files: [],
      tag: "",
      filesToUp: [],
      uploadFile: [{}],
      cancel: false,
      inputFile: true,
      showFiles: false,
      selectedFolder: "",
      progressColor: "info",
      loadedAjax1: 0,
      loadedAjax2: 0,
    };
    this.uploadMulti = this.uploadMulti.bind(this);
    this.backToHome = this.backToHome.bind(this);
    this.saveFiles = this.saveFiles.bind(this);
  }
  componentDidMount() {
    var files = this.props.files;
    this.setState({ files, loadBar: true });
  }
  changeProps = (files, showFolder, history) => {
    console.log("filesChangeProps" + history);
  };
  changeView = (view) => {
    console.log("changeView" + view);

    if (view == "trash") {
      this.props.history.push("/" + userName + "/trash");
    }
    if (view == "upload") {
      this.props.history.push("/" + userName + "/upload");
    }
    if (view == userName) {
      this.props.history.push("/" + userName);
    }
  };
  async saveFiles(files) {
    const rows = [];
    console.log("saveFiles");
    this.setState({ upload: false, showFiles: true });
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0");
    var yyyy = date.getFullYear();

    date = yyyy + "-" + mm + "-" + dd;

    if (files) {
      console.log("files", files);
      var myFiles = Object.values(files);

      var compressedFiles = [];
      var compressedFile;
      await Promise.all(
        myFiles.map(async (file) => {
          if (file.type.includes("image")) {
            console.log("in img type");
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            };
            console.log(file);

            compressedFile = await imageCompression(file, options);

            console.log("compressedFile  " + JSON.stringify(compressedFile));
            console.log(
              "compressedFile instanceof Blob",
              compressedFile instanceof Blob
            ); // true
            console.log(
              `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
            );
          } else {
            compressedFile = file;
            console.log(compressedFile.size)
          }
          const row = {
            all: iconsClasses[compressedFile.name.split(".")[1].toLowerCase()],
            name: compressedFile.name,
            date: date,
            file: compressedFile.name.split(".")[1],
            "file size": (compressedFile.size / 1024).toPrecision(4) + " KB",
            regret: (
              <Button
                variant="outline-danger"
                onClick={() => this.removeFile(compressedFile.name)}
              >
                X
              </Button>
            ),
          };
          rows.push(row);
          compressedFiles.push(compressedFile);
        })
      );
    }
    this.setState(
      {
        uploadFile: compressedFiles,
        filesToUp: rows,
        inputFile: false,
        showFiles: true,
      },
      () => {
        console.log(this.state.uploadFile);
        this.uploadMulti();
      }
    );
  }

  removeFile = (fileToRemove) => {
    console.log(fileToRemove);
    let { uploadFile, filesToUp } = this.state;
    let files = Object.values(uploadFile);
    files.forEach((file) => {
      if (file.name == fileToRemove) {
        files.pop(file);
      }
    });
    filesToUp.forEach((row) => {
      if (row.name == fileToRemove) {
        filesToUp.pop(row);
      }
    });
    this.setState({ filesToUp: filesToUp, uploadFile: files }, () => {
      console.log(this.state.uploadFile);
    });
  };

  backToHome = () => {
    console.log("in backToHome");
    this.setState({
      // inputFile: true,
      // showFiles: false,
      loadedAjax1: 0,
      loadedAjax2: 0,
    });

    this.props.loadFiles();
  };

  uploadMulti = () => {
    var formData = new FormData();
    var files = this.state.uploadFile;
    var myFiles = Object.values(files);
    console.log("files" + files.length);
    console.log(myFiles);
    if (!myFiles[0].name) {
      alert("ooops... not files to upload");
    } else {
      myFiles.forEach((file, index) => {
        if ((file.size) > 2097152) {//
          alert(
            `sorry, the file ${file.name} is too big file, Please remove it from the list`
          );
        } else {
          if (
            !file.type.includes("image") &&
            !file.type.includes("video") &&
            !file.type.includes("audio") &&
            !file.type.includes("pdf")
          ) {
            alert(
              `sorry, the file ${file.name} is not support, Please remove it from the list`
            );
          } else {
            formData.append("files" + index, file, file.name);
            formData.append("tags", this.state.selectedFolder);

            console.log(file);
          }
        }
      });

      console.log(formData.entries().next().value);
      if (!!formData.entries().next().value == true) {
        console.log("ok");
        this.setState({ loader: true }, console.log(this.state.loader));
        $.ajax({
          xhr: () => {
            let xhr = new XMLHttpRequest();

            xhr.upload.onloadstart = function () {
              console.log("Upload has started.");
            };

            xhr.upload.onprogress = (event) => {
              let uploadedBytes = (event.loaded / event.total) * 100;
              console.log(`Uploaded ${uploadedBytes} bytes 072-2467000
              `);
              this.setState({ loadedAjax1: uploadedBytes });
              if (uploadedBytes > 90) {
                this.setState({ loadedAjax1: 90 });
              }

              if (this.state.cancel == true) {
                xhr.abort();
              }
            };

            xhr.upload.onload = function () {
              console.log("Upload completed successfully.");
            };

            xhr.upload.onerror = function () {
              console.log(`Error during the upload: ${xhr.status}.`);
            };
            return xhr;
          },
          url:
            "https://files.codes/api/" +
            localStorage.getItem("userName") +
            "/uploadMultipleFiles",
          method: "post",
          contentType: false,
          processData: false,
          headers: { authorization: this.props.jwt },
          data: formData,
          error: (err) => {
            alert("err");
          },
          success: (data) => {
            var myData = { files: data.filesData };
            console.log(
              "finish first ajax  " +
                JSON.stringify(myData) +
                "...." +
                data.filesData
            );
            setTimeout(() => {
              $.ajax({
                xhr: () => {
                  let xhr = new XMLHttpRequest();

                  xhr.upload.onloadstart = function () {
                    console.log("Upload has started.");
                  };

                  xhr.upload.onprogress = (event) => {
                    let uploadedBytes = (event.loaded / event.total) * 10;
                    console.log(`Uploaded ${uploadedBytes} bytes`);
                    this.setState({
                      loadedAjax2: uploadedBytes,
                      progressColor: "success",
                    });
                  };

                  xhr.upload.onload = () => {
                    console.log("Upload completed successfully.");
                  };

                  xhr.upload.onerror = function () {
                    console.log(`Error during the upload: ${xhr.status}.`);
                  };
                  return xhr;
                },
                url:
                  "https://files.codes/api/" +
                  localStorage.getItem("userName") +
                  "/savedMultiFilesDB",
                method: "POST",

                headers: { authorization: this.props.jwt },
                data: myData,
                error: (err) => {
                  alert("upload canceled");
                  this.backToHome();
                },
                success: (data) => {
                  this.setState(
                    { loader: false },
                    console.log(this.state.loader)
                  );

                  console.log("upload success", data);

                  this.backToHome();
                },
              });
            }, 2000);
          },
        });
      }
    }
  };

  cancel = () => {
    this.setState({ cancel: true });
  };

  saveFolder = (selectedFolder) => {
    console.log("in saveFolder", selectedFolder);
    this.setState({ selectedFolder });
  };

  render() {
    const dragOver = (e) => {
      e.preventDefault();
    };

    const dragEnter = (e) => {
      e.preventDefault();
    };

    const dragLeave = (e) => {
      e.preventDefault();
    };

    const fileDrop = (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      console.log(files);
      this.saveFiles(files);
    };

    const fileInputClicked = () => {
      this.fileInputRef.current.click();
    };

    const filesSelected = () => {
      if (this.fileInputRef.current.files.length) {
        this.saveFiles(this.fileInputRef.current.files);
      }
    };

    const columns = [
      {
        dataField: "all",
        text: "ALL",
        sort: true,
        align: "center",
        style: { width: "7%", direction: "ltr" },
        headerAlign: "center",
      },
      {
        dataField: "name",
        text: "name",
        sort: true,
        headerAlign: "center",
        style: { width: "14%" },
      },
      {
        dataField: "date",
        text: "date",
        align: "center",
        sort: true,
        style: { width: "14%" },
        headerAlign: "center",
      },
      {
        dataField: "file",
        text: "file",
        sort: true,
        align: "center",
        style: { width: "7%" },
        headerAlign: "center",
      },
      {
        dataField: "file size",
        text: "size",
        align: "center",
        sort: true,
        style: { width: "7%" },
        headerAlign: "center",
      },
      {
        dataField: "regret",
        text: "regret",
        align: "center",
        sort: true,
        style: { width: "7%" },
        headerAlign: "center",
      },
    ];

    const notFiles = (
      <Row>
        <Col>oopsss...no files found 😞</Col>
        <Col>
          {" "}
          <Button
            variant="primary"
            onClick={() => this.setState({ inputFile: true, showFiles: false })}
          >
            back to upload
          </Button>
        </Col>
      </Row>
    );
    return (
      <div style={{ height: "100vh", backgroundColor: "#EDEEF0" }}>
        <Container fluid style={{ marginTop: "1%" }}>
          {this.state.loadBar && (
            <Navbar
              files={this.state.files}
              changeProps={(val, fol, history) => {
                this.changeProps(val, fol, history);
              }}
              changeView={(view) => {
                this.changeView(view);
              }}
            />
          )}
          <Row>
            <Col
              style={{
                backgroundColor: "white",
                borderRadius: "12px 0 0 12px",
                margin: "0.5%",
              }}
            >
              <Row>
                <Col>
                  {" "}
                  <Button
                    onClick={() => {
                      this.props.history.push("/" + userName);
                    }}
                    style={{ color: "#3A405E" }}
                  >
                    Back{" "}
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col
                  style={{ display: this.state.inputFile ? "block" : "none" }}
                >
                  <div
                    style={{
                      height: "80vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "auto",
                    }}
                  >
                    <div
                      id="fileUp"
                      onClick={fileInputClicked}
                      onDragOver={dragOver}
                      onDragEnter={dragEnter}
                      onDragLeave={dragLeave}
                      onDrop={fileDrop}
                      style={{
                        width: "70%",
                        height: "70%",
                        border: "4px dashed #E8E7F2",
                        textAlign: "center",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={uploadImg}
                        style={{ marginTop: "8%", marginBottom: "3%" }}
                      />
                      <h2
                        style={{
                          color: "#3A405E",
                          font: "normal normal medium 32px/43px Roboto",
                          letterSpacing: "0.58px",
                        }}
                      >
                        <p
                          id="upload"
                          style={{
                            color: "#3A405E",
                            textDecoration: "underline",
                            cursor: "pointer",
                            display: "inline",
                          }}
                        >
                          Upload
                        </p>
                        <p style={{ display: "inline" }}>
                          {" "}
                          or drag your files here
                        </p>{" "}
                      </h2>
                    </div>
                    <input
                      style={{ display: "none" }}
                      ref={this.fileInputRef}
                      className="file-input"
                      type="file"
                      multiple
                      onChange={filesSelected}
                    />
                  </div>
                </Col>

                <Col
                  style={{
                    minHeight: "80vh",
                    textAlign: "center",
                    padding: "0.5%",
                    display: this.state.showFiles ? "block" : "none",
                  }}
                >
                  {" "}
                  <div
                    style={{ width: "80%", margin: "10%", marginTop: "10%" }}
                  >
                    <BootstrapTable
                      keyField="id"
                      data={this.state.filesToUp}
                      columns={columns}
                      noDataIndication={notFiles}
                      bordered={false}
                      striped
                      hover
                      condensed
                      search
                    />
                  </div>
                  <Container style={{ marginTop: "10%" }}>
                    <Row
                      className="align-items-center justify-content-center"
                      style={{
                        backgroundColor: "#F8F8F8",
                        width: "100%",
                        height: "100px",
                      }}
                    >
                      <Col
                        className="align-items-center"
                        sm={6}
                        style={{ textAlign: "center" }}
                      >
                        <p
                          style={{
                            color: "#3A405E",
                            fontWeight: "bold",
                            fontSize: "20px",
                          }}
                        >
                          Which folder do you want to associate your files with?
                        </p>
                      </Col>
                      <Col
                        className="align-items-center"
                        sm={3}
                        style={{ textAlign: "left" }}
                      >
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            drop="up"
                            id="dropdown-basic"
                            style={{ padding: "2%" }}
                          >
                            {this.state.selectedFolder
                              ? this.state.selectedFolder
                              : "Choose Folder"}
                          </Dropdown.Toggle>

                          <Dropdown.Menu drop="up">
                            <Dropdown.ItemText>
                              <CreatableAdvanced
                                onSelectFolder={this.saveFolder}
                              />
                            </Dropdown.ItemText>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        {/* <button onClick={this.uploadMulti}>upload</button> */}
                      </Col>
                      {this.state.loader && (
                        <>
                          <Col>
                            <ProgressBar
                              variant={this.state.progressColor}
                              animated
                              now={
                                this.state.loadedAjax1 + this.state.loadedAjax2
                              }
                              label={`${
                                Math.round(this.state.loadedAjax1) +
                                Math.round(this.state.loadedAjax2)
                              }%`}
                            />
                          </Col>
                          <Col onClick={this.cancel}>X</Col>
                        </>
                      )}
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default Upload;
