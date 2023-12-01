import React, { Component } from "react";
import "./StartPage.css";
import StartPage1 from "./StartPage1";
import StartPage3 from "./StartPage3";
import { Navigate } from 'react-router-dom';

export default class StartPage extends Component {
  constructor() {
    super();
    this.state = { pageNo: 1 };
    this.onSlideLeft = this.onSlideLeft.bind(this);
    this.onSlideRight = this.onSlideRight.bind(this);
    this.setCirclesColor = this.setCirclesColor.bind(this);
    this.setCircleColorByID = this.setCircleColorByID.bind(this);
    this.setAnimation = this.setAnimation.bind(this);
    this.clearAnimation = this.clearAnimation.bind(this);
    this.touchstartX = 0;
    this.touchendX = 0;
  }

  componentDidMount() {
    window.addEventListener("keydown", (e) => {
      let key = e.key;

      if (key === "ArrowRight" || key === "ArrowLeft") this.setCirclesColor();
      if (key === "ArrowRight") this.onSlideRight();
      else if (key === "ArrowLeft") this.onSlideLeft();
      this.setCircleColorByID();
    });

    window.addEventListener("touchstart", (e) => {
      this.touchstartX = e.changedTouches[0].screenX;
    });

    window.addEventListener("touchend", (e) => {
      this.touchendX = e.changedTouches[0].screenX;
      this.handleGesture();
    });
  }

  clearAnimation(element) {
    element.style.animationDuration = "";
    element.style.transitionTimingFunction = "";
    element.style.animationFillMode = "";
    element.style.animationName = "";
  }

  setCirclesColor() {
    try {
    let circles = document.querySelectorAll(".circle");
    circles.forEach((circle) => {
      circle.style.backgroundColor = "#606060FF";
      this.clearAnimation(circle);
    });
  }
  catch {
    ;
  }
  }

  setAnimation(element) {
    element.animationDuration = "0.7s";
    element.transitionTimingFunction = "ease-in";
    element.animationFillMode = "both";
    element.animationName = "fadeIn";
  }
  setCircleColorByID() {
    try {
    let circle = document.getElementById(`c${this.state.pageNo}`).style;
    let frame = document.getElementById("frame").style;
    this.setAnimation(circle);
    circle.backgroundColor = "#D6ED17FF";
    }
    catch {
      ;
    }
  }

  handleGesture() {
    this.setCirclesColor();
    if (this.touchendX < this.touchstartX)
      //Swipe left
      this.onSlideRight();
    else if (this.touchendX > this.touchstartX) this.onSlideLeft();
    this.setCircleColorByID();
  }

  onSlideRight() {
    if (this.state.pageNo < 2) this.setState({ pageNo: this.state.pageNo + 1 });
  }

  onSlideLeft() {
    if (this.state.pageNo > 1) this.setState({ pageNo: this.state.pageNo - 1 });
  }

  render() {
    const setHeight = () => {
      try {
      document.getElementById("start").style.height = window.innerHeight + "px";
      document.getElementById("startPage1").style.height =
        window.innerHeight + "px";
      document.getElementById("start").style.width = window.innerWidth + "px";
      document.getElementById("startPage1").style.width =
        window.innerWidth + "px";
      let frame = document.getElementById("frame").style;
      frame.height = window.innerHeight / 2 + "px";
      frame.width = window.innerWidth / 1.5 + "px";
      frame.left = window.innerWidth / 6 + "px";
      frame.top = window.innerHeight / 5 + "px";
      let slide = document.getElementById("slide").style;
      slide.top = window.innerHeight * 0.82 + "px";
      slide.left = window.innerWidth / 2 - 36 + "px";
      }
      catch{
        ;
      }
    };
    window.addEventListener("resize", setHeight);

    return (
      <>
      {localStorage.getItem('Email') ? <Navigate to='/do-it' replace={true}/> : localStorage.getItem('stateShown') ? <Navigate to='/sign-in' replace={true}/> : undefined}
      <div
        id="start"
        style={{
          height: window.innerHeight + "px",
          width: window.innerWidth + "px",
        }}
      >
        <div
          id="startPage1"
          style={{
            height: window.innerHeight + "px",
            width: window.innerWidth + "px",
          }}
        >
          <div
            id="frame"
            style={{
              height: window.innerHeight / 2 + "px",
              width: window.innerWidth / 1.5 + "px",
              left: window.innerWidth / 6 + "px",
              top: window.innerHeight / 5 + "px",
            }}
          >
            {this.state.pageNo === 1 ? (
              <StartPage1
                setAnimation={this.setAnimation}
                clearAnimation={this.clearAnimation}
              />
            ) : this.state.pageNo === 2 ? (
              <StartPage3
                navigate={this.props.navigate}
                setAnimation={this.setAnimation}
                clearAnimation={this.clearAnimation}
              />
            ) : undefined}
          </div>
          <div
            id="slide"
            style={{
              top: window.innerHeight * 0.82 + "px",
              left: window.innerWidth / 2 - 36 + "px",
            }}
          >
            <div
              className="circle"
              id="c1"
              style={{ backgroundColor: "#D6ED17FF" }}
            ></div>
            <div className="circle" id="c2" style={{backgroundColor: "#606060FF"}}></div>
          </div>
        </div>
      </div>
      </>
    );
  }
}
