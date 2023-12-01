import React, { Component } from "react";
import icon from "./res/dictionary.jpg";
import { Link } from 'react-router-dom';
import Alert from './Alert';
import Spinner from "./Spinner";
import data from './URL.json'
import "./SignUp.css";

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.authenticate = this.authenticate.bind(this);
        this.SignUp = this.SignUp.bind(this);
        this.generateOTP = this.generateOTP.bind(this);
        this.props.setStateData('password', 'visibility')
        this.props.setStateData('confirm-password', 'visibility')
    }

    async SignUp(event) {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value.toLowerCase();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      if(password !== confirmPassword)
        this.props.alertFunc('danger', 'Passwords do not match!!');
      else
      {
      let bg = document.getElementById('DoItBackground').style;
      const PORT = process.env.PORT || 4000;
      const otp = this.generateOTP();
      let url = process.env.NODE_ENV === 'production' ? 'https://my-dictionary.onrender.com/api/auth/sendOTP' : `${data.URL}:${PORT}/api/auth/sendOTP`
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
          otp
        }),
      }).then((res) => res.json());

      this.props.setStateData('load', false);
      bg.filter = '';
      if (result.status === "ok") {
        this.props.alertFunc('success', 'OTP Sent Successfully!!!');
        this.props.setStateData('data', {name: name, email: email, password: password, otp: otp});
        this.props.navigate('/otp', false);
      } else if(result.status === "Exists"){
        this.props.alertFunc('danger', "Email Already Exists!!!");
      }
      else if(result.status === "error")
        this.props.alertFunc('danger', "Unable to Send OTP!!!");
    }
    }

    generateOTP() {
      return Math.floor(100000 + Math.random() * 900000);
    }

    authenticate() {
      const form = document.getElementById('SignUp')
      form.addEventListener('submit', this.SignUp)
    }

    componentDidMount() {
        this.props.alignForm();
        let SignUpC = document.getElementById('SignUpContainer').style;
        SignUpC.height = window.innerHeight - 60 - ((window.innerHeight/5)+72) + "px";
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
          <p id="SignUpFont">Sign Up</p></div>
          <div id="SignUpContainer">
          <form id="SignUp" action="/api/SignUp" autoComplete="current-password">
          <div className="form">
                  <label for="name">
                    <i className="name material-icons"></i>
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter Username"
                    required
                  />
                </div>
                <div className="form">
                  <label for="email">
                    <i className="email material-icons"></i>
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter Email"
                    required
                  />
                </div>
                <div className="form">
                  <label for="password">
                    <i className="password material-icons"></i>
                    <button
                    type="button"
                    id="show-password"
                    autoComplete="new-password"
                    onClick={() => this.props.passwordHandle('password', 1)}
                  >
                    <i className="showPassword material-icons">{this.props.state.password}</i>
                  </button>
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="Pass"
                    placeholder="Enter Password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>
                <div className="form">
                  <label for="confirm-password">
                    <i className="password material-icons"></i>
                    <button
                    type="button"
                    id="show-password"
                    onClick={() => this.props.passwordHandle('confirm-password', 2)}
                  >
                    <i className="showPassword material-icons">{this.props.state.confirmPassword}</i>
                  </button>
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="Pass"
                    placeholder="Confirm Password"
                    minLength={8}
                    required
                  />
                </div>
                <div className="form">
                <button type="submit" name="submit" id="submit" class="form-submit btn btn-primary" onClick={this.authenticate}>Register</button>
                </div>
          </form>
          <div id="linkSignIn">
              <p id='SignInFont'>Already Have an Account?<Link to="/sign-in" className="signIn-visit" replace={true}>Click Here</Link></p>
          </div>
          </div>
      </div>
      </>
    );
  }
}
