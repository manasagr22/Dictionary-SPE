import React, { Component } from "react";
import './StartPage.css'
import icon from "./res/dictionary.jpg";

export default class StartPage1 extends Component {
  componentDidMount() {
    let Div = document.getElementById('start1');
    this.props.setAnimation(Div.style);
  }

  render() {
    const setHeight = () => {
      try {
        let iconDiv = document.getElementById('iconDiv').style;
        iconDiv.height = window.innerHeight/2.8+"px";
        let iconD = document.getElementById('icon').style;
        iconD.height = window.innerHeight/2.8+"px";
      }
      catch {
        ;
      }
    }
    window.addEventListener("resize", setHeight);
    return (
      <>
      <div id="start1">
        <p id="title">Dictionary</p>
        <div id="iconDiv" style={{ height: window.innerHeight / 2.8 + "px" }}>
          <img
            src={icon}
            id="icon"
            alt="Icon"
            style={{ height: window.innerHeight / 2.8 + "px" }}
          ></img>
        </div>
      </div>
      </>
    );
  }
}
