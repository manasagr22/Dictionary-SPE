import React, { Component } from "react";
import icon from "./res/dictionary.jpg";
import { Link } from 'react-router-dom';
import Spinner from './Spinner'
import Alert from './Alert'
import data from './URL.json'
import "./SignUp.css";
import './OTP.css';

export default class OTP extends Component {
    constructor(props) {
        super(props);
        this.authenticate = this.authenticate.bind(this);
        this.SignUp = this.SignUp.bind(this);
        this.Resend = this.Resend.bind(this);
        this.props.setStateData('password', 'visibility');
        this.props.setStateData('popCount', 0);
    }

    async Resend(){
      let otp = this.props.state.data.otp;
      let email = this.props.state.data.email;
      let name = this.props.state.data.name;
      let bg = document.getElementById('DoItBackground').style;
      const PORT = process.env.PORT || 4000;
        let url = process.env.NODE_ENV === 'production' ? 'https://my-dictionary.onrender.com/api/auth/sendOTP' : `${data.URL}:${PORT}/api/auth/sendOTP`
      bg.filter = 'blur(2px)';
      this.props.setStateData('load', true);
      let result = await fetch(url, {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            otp
          }),
        }).then((res) => res.json());
        this.props.setStateData('load', false);
        bg.filter = '';
        if (result.status === "ok") {
          this.props.alertFunc('success', 'OTP Sent Successfully!!!');
        } else {
          this.props.alertFunc('danger', "Unable to Send OTP!!!");
        }
    }

    async SignUp(event) {
      event.preventDefault();
      const otp = document.getElementById('password').value;
    if(Number(otp) === this.props.state.data.otp)
    {
      let name = this.props.state.data.name;
      let email = this.props.state.data.email;
      let password = this.props.state.data.password;
      let bg = document.getElementById('DoItBackground').style;
      const PORT = process.env.PORT || 4000;
      let url = process.env.NODE_ENV === 'production' ? 'https://my-dictionary.onrender.com/api/auth/signUp' : `${data.URL}:${PORT}/api/auth/signUp`
      bg.filter = 'blur(2px)';
      this.props.setStateData('load', true);
      const result = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({
              name,
              email,
              password          
            }),
        }).then((res) => res.json());
        this.props.setStateData('load', false);
        bg.filter = '';
      if(result.status === "ok")
      {
        this.props.alertFunc('success', 'Registration Successful!!!');
        this.props.navigate('/sign-in', true);
      }
      else
      {
        this.props.alertFunc('danger', 'Some Error Occurred!!!');
        this.props.navigate(-1, true);
      }
    }
    else
    {
      this.props.alertFunc('danger', 'Incorrect OTP!!!');
    }
  }

    authenticate() {
      const form = document.getElementById('SignUp')
      form.addEventListener('submit', this.SignUp)
    }

    componentDidMount() {
        this.props.alignForm();
        let SignUpC = document.getElementById('SignUpContainer').style;
        SignUpC.height = window.innerHeight - 60 - ((window.innerHeight/5)+72) + "px";
        window.onpopstate = () => {
          if(this.props.state.popCount === 0)
          {
            this.props.setStateData('popCount', 1);
            window.history.pushState({}, undefined, "/sign-up");
            this.props.navigate(-1, true);
          }
        }
    }

  render() {
    window.addEventListener("resize", this.props.setHeight);
    return (
      <>
      {this.props.state.load && <Spinner/>}
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
          <p id="SignUpFont">OTP</p>
          <p id="BelowOTP">Enter OTP sent to your email</p>
          </div>
          <div id="SignUpContainer" style={{top: '105px'}}>
          <form id="SignUp" action="/api/SignUp">
                <div className="form">
                  <label for="password">
                    <i className="password material-icons"></i>
                    <button
                    type="button"
                    id="show-password"
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
                    required
                  />
                </div>
                <div className="form">
                <button type="submit" name="submit" id="submit" class="form-submit btn btn-primary" onClick={this.authenticate}>Verify</button>
                </div>
          </form>
          <div id="linkSignIn">
              <p id='SignInFont'>Didn't Receive the OTP?<button type="button" id="resend" className="signIn-visit" onClick={this.Resend}>Resend OTP</button></p>
          </div>
          </div>
      </div>
      </>
    );
  }
}