import React, { Component } from "react";
import icon from "./res/dictionary.jpg";
import data from './URL.json';
import { Link } from 'react-router-dom';
import Spinner from './Spinner'
import Alert from './Alert'
import "./SignUp.css";
import "./SignIn.css"

export default class SignIn extends Component {
    constructor(props) {
        super(props);
        this.authenticate = this.authenticate.bind(this);
        this.SignIn = this.SignIn.bind(this);
        this.props.setStateData('password', 'visibility')
        this.props.setStateData('confirm-password', 'visibility')
    }

    async SignIn(event) {
      event.preventDefault();
      const email = document.getElementById('email').value.toLowerCase();
      const password = document.getElementById('password').value;

      let bg = document.getElementById('DoItBackground').style;
      this.props.setStateData('load', true);
      bg.filter = 'blur(2px)';
      const PORT = process.env.PORT || 4000;
      let url = process.env.NODE_ENV === 'production' ? 'https://my-dictionary.onrender.com/api/auth/signIn' : `${data.URL}:${PORT}/api/auth/signIn`
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password
        }),
      }).then((res) => res.json());

      this.props.setStateData('load', false);
      bg.filter = '';
      if (result.status === "ok") {
        setTimeout(() => {
          this.props.alertFunc('success', 'Logged In Successfully!!!');
        this.props.data[0] = result.name;
        this.props.data[1] = email;
        localStorage.setItem('Name', this.props.data[0]);
        localStorage.setItem('Email', this.props.data[1]);
          this.props.navigate('/do-it', true)
        }, 1000);
      } else {
        this.props.alertFunc("danger", result.error);
      }
    }

    authenticate() {
      const form = document.getElementById('SignUp')
      form.addEventListener('submit', this.SignIn)
    }

    componentDidMount() {
      // window.addEventListener("resize", this.props.setHeight);
        this.props.alignForm();
        let SignUpC = document.getElementById('SignUpContainer').style;
        SignUpC.height = window.innerHeight - 60 - ((window.innerHeight/5)+72) + "px";
    }

    // componentDidMount() {
    //   window.addEventListener('resize', this.updateDimensions);
    // }
    // componentWillUnmount() {
    //   window.addEventListener("resize", this.props.setHeight);
    // }
  render() {
    window.addEventListener("resize", this.props.setHeight);
    if(localStorage.getItem('Email'))
      this.props.navigate('/do-it', true);
    return (
      <>
      {this.props.state.load && <Spinner/>}
      {localStorage.getItem('stateShown') ? undefined : localStorage.setItem('stateShown', true)}
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
          <p id="SignUpFont">Sign In</p></div>
          <div id="SignUpContainer">
          <form id="SignUp" action="/api/SignIn">
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
                    required
                  />
                </div>
                <div className="form">
                <button type="submit" name="submit" id="submit" class="form-submit btn btn-primary" onClick={this.authenticate}>Login</button>
                </div>
          </form>
          <div id="linkSignIn">
              <p id='SignInFont'>Forgot Password?<Link to="/forgot-password" className="signIn-visit" replace={false}>Click Here</Link></p>
          </div>
          <div id="linkSignIn">
              <p id='SignInFont'>Don't Have an Account?<Link to="/sign-up" className="signIn-visit" replace={true}>Create One</Link></p>
          </div>
          </div>
      </div>
      </>
    );
  }
}
