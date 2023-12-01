import React, { Component } from "react";
import icon from "./res/dictionary.jpg";
import { Link } from 'react-router-dom';
import data from './URL.json'
import Alert from './Alert';
import Spinner from "./Spinner";
import "./SignUp.css";

export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.authenticate = this.authenticate.bind(this);
        this.ChangePass = this.ChangePass.bind(this);
        this.props.setStateData('password', 'visibility');
        this.props.setStateData('confirm-password', 'visibility');
    }

    async ChangePass(event) {
      event.preventDefault();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      if(password !== confirmPassword) {
        this.props.alertFunc('danger', "Passwords do not match!!");
      }
      else
      {
      let bg = document.getElementById('DoItBackground').style;
      const PORT = process.env.PORT || 4000;
      let url = process.env.NODE_ENV === 'production' ? 'https://my-dictionary.onrender.com/api/auth/changePassword' : `${data.URL}:${PORT}/api/auth/changePassword`
      bg.filter = 'blur(2px)';
      let email = this.props.state.data.email;
      let name = this.props.state.data.name;
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
      if (result.status === "ok") {
        this.props.alertFunc('success', 'Password Changed!!!');
        this.props.navigate('/sign-in', true);
      }
      else if(result.status === "error")
        this.props.alertFunc('danger', "Unable to change Password!!!");
    }
    }

    authenticate() {
      const form = document.getElementById('ChangePassword')
      form.addEventListener('submit', this.ChangePass)
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
          <p id="SignUpFont" style={{width: '336px'}}>Change Password</p></div>
          <div id="SignUpContainer">
          <form id="ChangePassword" autoComplete="current-password">
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
                    placeholder="Enter New Password"
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
                <button type="submit" name="submit" id="submit" class="form-submit btn btn-primary" onClick={this.authenticate}>Confirm</button>
                </div>
          </form>
          </div>
      </div>
      </>
    );
  }
}
