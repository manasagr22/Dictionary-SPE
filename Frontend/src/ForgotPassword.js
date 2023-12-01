import React, { Component, useEffect } from "react";
import { BackHandler } from 'react-native-web';
import icon from "./res/dictionary.jpg";
import { Link } from 'react-router-dom';
import "./SignUp.css";
import "./SignIn.css"
import data from './URL.json'
import Alert from './Alert'
import SpinnerVerify from "./SpinnerVerify";
import './ForgotPassword.css'

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.authenticate = this.authenticate.bind(this);
        this.Forgot = this.Forgot.bind(this);
        this.VerifyIt = this.VerifyIt.bind(this);
        this.generateOTP = this.generateOTP.bind(this);
        this.props.setStateData('popCount', 0);
        this.state = {disable: true, spinnerActive: false, verify: false, otp: null};
    }

    async Forgot() {
      let email = document.getElementById('email').value.toLowerCase();
      this.props.setStateData('data', {email: email})
      if(email.length === 0)
        this.props.alertFunc('danger', 'Email cannot be empty!!');
      else
      {
        const otp = this.generateOTP();
        this.setState({
          otp: otp,
        })
        this.setState({
          spinnerActive: true,
        });
        
      const PORT = process.env.PORT || 4000;
        
      let url = process.env.NODE_ENV === 'production' ? 'https://my-dictionary.onrender.com/api/auth/verifyEmail' : `${data.URL}:${PORT}/api/auth/verifyEmail`
        let result = await fetch(url, {
            method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                otp
              }),
          }).then((res) => res.json());
          
          this.setState({
            spinnerActive: false,
          });
      
          if(result.status === "ok")
          {
            this.setState({
              verify: true,
              disable: false,
            })
            this.props.setStateData('data', {name: result.name, email: email})
            this.props.alertFunc('success', 'Enter OTP sent to your Registered Email ID!');

          }
          else if(result.status === "Not Exists")
          {
            this.setState({
              verify: false,
            })
            this.props.alertFunc('danger', "Email ID is not Registered!!!");
          }
          else
          {
            this.setState({
              verify: false,
            })
            this.props.alertFunc('danger', "Some Error occurred!!!");
          }
      }
    }

    VerifyIt(event) {
      event.preventDefault();
      let otpCheck = document.getElementById('password').value;
      if(this.state.otp === Number(otpCheck))
      {
        this.props.alertFunc('success', "Email Verified!");
        this.props.navigate('/change-password', true);
      }
      else
        this.props.alertFunc('danger', "OTP is Incorrect!!!");
    }

    authenticate() {
      const form = document.getElementById('SignUp')
      form.addEventListener('submit', this.VerifyIt)
    }

    generateOTP() {
      return Math.floor(100000 + Math.random() * 900000);
    }

    componentDidMount() {
        this.props.alignForm();
        let SignUpC = document.getElementById('SignUpContainer').style;
        SignUpC.height = window.innerHeight - 60 - ((window.innerHeight/5)+72) + "px";
        window.onpopstate = () => {
          if(this.props.state.popCount === 0)
          {
            this.props.setStateData('popCount', 1);
            window.history.pushState({}, undefined, "/sign-in");
            this.props.navigate(-1, true);
          }
        }
    }

  render() {
    window.addEventListener("resize", this.props.setHeight);
    return (
      <div
        id="DoItBackground"
        style={{
          height: window.innerHeight + "px",
          width: window.innerWidth + "px",
        }}
      >
        {this.props.state.alert !== null ? <Alert alert={this.props.state.alert}/> : undefined}
        <div id="iconImageDo" style={{width: window.innerWidth+"px", height: (window.innerHeight/5)+57 + "px"}}>
          <img
            src={icon}
            id="iconDo"
            alt="Icon"
            style={{ height: window.innerHeight / 5 + "px", left: (window.innerWidth/2)-82+"px"}}
          ></img>
          <p id="SignUpFont" style={{width: '321px'}}>Forgot Password</p></div>
          <div id="SignUpContainer">
          <form id="SignUp" action="/api/SignIn" autoComplete="off">
                <div className="form" id="verifyIt">
                  <label for="email">
                    <i className="email material-icons"></i>
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter Registered Email"
                    required
                  />
                  {this.state.spinnerActive === true ? <SpinnerVerify/> : this.state.verify === true ? <i class="verify material-icons"></i> : <button type="button" className="verify-forgot" onClick={this.Forgot}>Verify</button>}
                </div>
                <div className="form">
                  <label for="password">
                    <i className="password material-icons"></i>
                    <button
                    type="button"
                    id="show-password"
                    disabled={this.state.disable}
                    onClick={() => this.props.passwordHandle('password', 1)}
                  >
                    <i className="showPassword material-icons">{this.props.state.password}</i>
                  </button>
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="Pass"
                    placeholder="Enter OTP"
                    disabled={this.state.disable}
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="form">
                <button type="submit" name="submit" id="submit" class="form-submit btn btn-primary" onClick={this.authenticate} disabled={this.state.disable}>Continue</button>
                </div>
          </form>
          </div>
      </div>
    );
  }
}