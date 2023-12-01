import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react'
import StartPage from './StartPage';
import OTP from './OTP';
import { Routes, Route, useNavigate } from "react-router-dom";
import SignUp from './SignUp';
import SignIn from './SignIn';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';
import DoIt from './DoIt';

class App extends Component {
  constructor(){
    super();
    this.state = {
      alert: null,
      load: false,
      password: 'visibility',
      confirmPassword: 'visibility',
      data: null,
      popCount: null,
      dictionary: null,
      stateShown: false,
    }
    this.handleAlert = this.handleAlert.bind(this);
    this.navigator = this.navigator.bind(this);
    this.alignForm = this.alignForm.bind(this);
    this.setHeight = this.setHeight.bind(this);
    this.passwordHandle = this.passwordHandle.bind(this);
    this.setStateData = this.setStateData.bind(this);

    this.data = [null, null];
    this.active = [false, false];
  }
   
  navigator = (position, replace) => {  
      this.props.navigate(position, { replace: replace })
   }

  alignForm() {
    let form = document.querySelectorAll('.form');
    form.forEach((element) => {
        element.style.left = (window.innerWidth/2)-132+"px";
    });
  }

  setHeight = () => {
    try {
    let iconImageDo = document.getElementById('iconImageDo').style;
    let iconDo = document.getElementById('iconDo').style;
    let DoItBackground = document.getElementById('DoItBackground').style;
    let SignUpC = document.getElementById('SignUpContainer').style;
    DoItBackground.height = window.innerHeight+"px";
    DoItBackground.width = window.innerWidth+"px";
    iconImageDo.width = window.innerWidth+"px";
    iconImageDo.height = (window.innerHeight/5)+57+"px"
    iconDo.height = window.innerHeight/5 + "px";
    iconDo.left = (window.innerWidth/2)-82+"px";
    SignUpC.height = window.innerHeight - 60 - ((window.innerHeight/5)+72) + "px";
    this.alignForm();
    }
    catch {
      ;
    }
}

   passwordHandle(id, flag) {
    let x = document.getElementById(id);
  if (x.type === "password") {
    x.type = "text";
    if(flag === 1)
      this.setState({password: "visibility_off"});
    else
      this.setState({confirmPassword: "visibility_off"});
  } else {
    x.type = "password";
    if(flag === 1)
      this.setState({password: "visibility"});
    else
      this.setState({confirmPassword: "visibility"});
  }
  }

  setStateData(element, data) {
    if(element === 'password')
    {
      this.setState({
        password: data,   
      });
    }
    else if(element === 'confirm-password')
    {
      this.setState({
        confirmPassword: data,   
      });
    }
    else if(element === 'alert')
    {
      this.setState({
        alert: data,   
      });
    }
    else if(element === 'load')
    {
      this.setState({
        load: data,   
      });
    }
    else if(element === 'data')
    {
      this.setState({
        data: data,   
      });
    }
    else if(element === 'stateShown') {
      this.setState({
        stateShown: data,
      });
    }
    else if(element === 'popCount')
    {
      this.setState({
        popCount: data,   
      }, window.onpopstate = () => {});
    }
  }

   handleAlert = (flag, msg) => {
    if (flag === "success") {
      this.setState({
      alert: {
        msg: msg,
        d: "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z",
        type: flag,
      }
    });

      setTimeout(() => {
        this.setState({
          alert: null
        })
      }, 1800);
    } else {
      this.setState({
      alert: {
        msg: msg,
        d: "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
        type: flag,
      }
    });

      setTimeout(() => {
        this.setState({
          alert: null
        })
      }, 1800);
    }
  };


  render() {
    return (
      <div>
        <Routes>
          <Route exact path="/" element={<StartPage navigate={this.navigator}/>}></Route>
          <Route exact path='/sign-up' element={<SignUp navigate={this.navigator} passwordHandle={this.passwordHandle} state={this.state} setStateData={this.setStateData} setHeight={this.setHeight} alignForm={this.alignForm} alertFunc={this.handleAlert}/>}></Route>
          <Route exact path='/otp' element={<OTP navigate={this.navigator} passwordHandle={this.passwordHandle} state={this.state} setStateData={this.setStateData} setHeight={this.setHeight} alignForm={this.alignForm} alertFunc={this.handleAlert}/>}></Route>
          <Route exact path='/sign-in' element={<SignIn navigate={this.navigator} data={this.data} passwordHandle={this.passwordHandle} state={this.state} setStateData={this.setStateData} setHeight={this.setHeight} alignForm={this.alignForm} alertFunc={this.handleAlert}/>}></Route>
          <Route exact path='/forgot-password' element={<ForgotPassword navigate={this.navigator} passwordHandle={this.passwordHandle} state={this.state} setStateData={this.setStateData} setHeight={this.setHeight} alignForm={this.alignForm} alertFunc={this.handleAlert}/>}></Route>
          <Route exact path='/change-password' element={<ChangePassword navigate={this.navigator} passwordHandle={this.passwordHandle} state={this.state} setStateData={this.setStateData} setHeight={this.setHeight} alignForm={this.alignForm} alertFunc={this.handleAlert}/>}></Route>
          <Route exact path='/do-it' element={<DoIt navigate={this.navigator} state={this.state} data={this.data} active={this.active} setStateData={this.setStateData} alertFunc={this.handleAlert} />}></Route>
          <Route exact path='/addTask' element={<DoIt navigate={this.navigator} state={this.state} data={this.data} active={this.active} setStateData={this.setStateData} alertFunc={this.handleAlert} />}></Route>
        </Routes>
      </div>
    )
  }
}

function WithNavigate(props) {
  let navigate = useNavigate();
  return <App navigate={navigate} />
}

export default WithNavigate
