import React, { Component } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { defaultTheme } from 'react-select';
import $ from 'jquery';
import Folder from './assets/folder-solid-g.png'
const { colors } = defaultTheme;
const components = {
    DropdownIndicator: null,
  };
 
const selectStyles = {
  control: provided => ({ ...provided, minWidth: 240, margin: 8 }),
  menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)',borderRadius: "2px",backgroundColor: "#FAFAFA",color:"#8181A5" }),
};
let jwtFromCookie = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJ1TEtTN0RQa1dzZHl3bW4xTGFSdjFnSTNSWUwyIiwiZW1haWwiOiJ1dmlAbGVhZGVyLmNvZGVzIiwiaXAiOiIxNDEuMjI2LjEyMi4xNjgiLCJpYXQiOjE2MDM3OTE1MTh9.y8kzi4v4DjYwWQQqoBKwp4BqhsZrBQtBXnNyDmjzbt4'

export  class CreatableAdvanced extends Component {
    state = { isOpen: true, value1: undefined,value2:[],files:[],stateOptions:[],showCreate:true,
           input: (<div  style={{backgroundColor:"#5E81F4",borderRadius:"8px",color:"white",height:"40px",display: "flex",justifyContent: "center",
           alignItems: "center",fontSize:"110%"}}>New folder +</div>)
        
          
   
    };
    componentDidMount() {

      let url = window.location;
      let userName = url.pathname.split("/")[1];
      console.log(userName);
      localStorage.setItem("userName", userName);
      this.loadFiles()
      
      }
      loadFiles(){
        console.log('load')
        $.ajax({
          type: "GET",
          url: "https://files.leader.codes/api/"
          // +"uLKS7DPkWsdywmn1LaRv1gI3RYL2",
          
          
          +localStorage.getItem('uId'),
          headers: { Authorization: jwtFromCookie },
        
          success:  (data)=> {
            // data = JSON.parse(data);
            console.log("**",data,data.length);
            if (data.length > 0) {
             console.log(data)
            
             this.setState({files:data},()=>  
            this.loadFolders()               
           
              
          
          
                
          
          
          
             
            )
             
            }
          },
        });
      }
    
    loadFolders (){
        console.log("loadFolders")
      const stateOptions = this.state.stateOptions 
     
          const foldersVies = []
          const folders = []
          
          this.state.files.forEach(file=>{
            
          if(file.tags!=""&&file.tags!="null"&&file.tags){
              const folder = file.tags.split("/")
              folder.forEach(folder=>folders.push(folder)
                )
             
          
           
           
           
            
                   
          
          }
            })
          
          let stringArray = folders.map(JSON.stringify);
          let uniqueStringArray = new Set(stringArray);
          
          var foldersArr = []
          
          uniqueStringArray.forEach(str=>{
            foldersArr.push(str)
          })
          
          
          foldersArr.forEach(folder=>{
            
            if(folder&&!folder.includes("\\")&&folder!='"undefined"' ){
              
              // console.log(folder)
              const clean = folder.replace(/["']/g, "")
              const icon = (<div className="selectFolder"><img src={Folder} style={{marginRight:'5%'}}/>{clean}</div>)
            
              
              stateOptions.push({value:clean,label:icon})
              this.setState({stateOptions},()=>{
                console.log(this.state.stateOptions)
              })
                    console.log(clean)
            }
          
             }
          
          )
      
    }
  
    toggleOpen = () => {
      console.log('toggleOpen')
      this.setState(state => ({ isOpen: !state.isOpen }));
    };
 
      onSelectChange = value1 => {
        this.toggleOpen();
        if(value1){
        this.setState({ value1:value1 });
        console.log(value1.value)
        this.props.onSelectFolder(value1.value)}

      };
      handleChange = (newValue, actionMeta) => {
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
        this.setState({ value2: newValue })
      };
      handleInputChange = (inputValue, actionMeta) => {
        console.group('Input Changed');
        console.log(inputValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
        this.setState({ inputValue });
       
    
      };
     
      handleKeyDown = (event) => {
        const { inputValue, value2,stateOptions } = this.state;
        if (!inputValue) return;
        switch (event.key) {
          case 'Enter':
          case 'Tab':
            console.group('Value Added');
            console.log(value2);
            console.log("inputValue", inputValue)
            console.groupEnd();
            if(value2){
                stateOptions.push({value:inputValue,label:(<div><img src={Folder} style={{marginRight:'5%'}}/>{inputValue}</div>)})
            this.setState({
              inputValue: '',
              value1: {value:inputValue,label:inputValue},
              stateOptions
            },()=>{
                console.log(this.state.stateOptions);
                this.toggleOpen();
            
            });}
            event.preventDefault();
        }
      };
       changeInputFolder=()=>{
        this.setState({input:(<CreatableSelect
          components={components}
            inputValue={this.state.inputValue}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={this.handleChange}
            onInputChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            placeholder="Folder Name"
          
          />)})
        
      }
     
  render() {
    const { isOpen, value1,inputValue,value2 } = this.state;
   var newFolder=this.state.input
  
    return (<div>
{/*       
       <CreatableSelect
      className="test123"
      components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder="New Folder +"
      
      />
  */}
  <div  onMouseEnter={this.changeInputFolder}>{newFolder}</div>
  
  {/* {this.newFolder} */}
        <Select
      
      
        // styles={customStyles}
        
    //   menuPlacement="top"
          autoFocus
          backspaceRemovesValue={false}
          components={{ DropdownIndicator, IndicatorSeparator: null }}
          controlShouldRenderValue={true}
          hideSelectedOptions={false}
          isClearable={true}
          menuIsOpen={isOpen}
          onChange={this.onSelectChange}
          options={this.state.stateOptions}
          placeholder="Type to start searching..."
          styles={selectStyles}
          tabSelectsValue={false}
          value={value1}
        
        />
      </div>
      
    );
  }
}
const Menu = props => {
    const shadow = 'hsla(218, 50%, 10%, 0.1)';
    return (
      <div
        css={{
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
          marginTop: 8,
          position: 'absolute',
          zIndex: 2,
          
        }}
        {...props}
      />
    );
  };
  const Blanket = props => (
    <div
      css={{
        bottom: 0,
        left: 0,
        top: 0,
        right: 0,
        position: 'fixed',
        zIndex: 1,
      }}
      {...props}
    />
  );
  const Dropdown = ({ children, isOpen, target, onClose }) => (
    <div css={{ position: 'relative' }}>
      {target}
      {isOpen ? <Menu>{children}</Menu> : null}
      {isOpen ? <Blanket onClick={onClose} /> : null}
    </div>
  );
  const Svg = p => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      focusable="false"
      role="presentation"
      {...p}
    />
  );
  const DropdownIndicator = () => (
    <div css={{ color: colors.neutral20, height: 24, width: 32 }}>
      <Svg>
        <path
          d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </Svg>
    </div>
  );
  // const customStyles = {
  //   option: (provided, state) => ({
  //     ...provided,
  //     borderBottom: '1px dotted pink',
  //     color: state.isSelected ? 'red' : 'blue',
  //     padding: 20,
  //   }),
  //   control: (state) => {
  //     // none of react-select's styles are passed to <Control />
  //     // width: 200,
  //     // backgroundColor:"red",
  //     const show=state.showCreateInput ? 'block' : 'none'
  //     return{...show}

  //   },
  //   singleValue: (provided, state) => {
  //     const opacity = state.isDisabled ? 0.5 : 1;
  //     const transition = 'opacity 300ms';
  
  //     return { ...provided, opacity, transition };
  //   }
  // }
  const ChevronDown = () => (
    <Svg style={{ marginRight: -6 }}>
      <path
        d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  );
export default CreatableAdvanced