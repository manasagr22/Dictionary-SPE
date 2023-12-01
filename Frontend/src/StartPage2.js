import React, { Component } from 'react'
import './StartPage.css'
import icon from './res/dictionary.jpg'

export default class StartPage2 extends Component {
  componentDidMount() {
    let Div = document.getElementById('start2');
    this.props.setAnimation(Div.style);
  
  }
  render() {
    const setHeight = () => {
      try {
        let iconDiv = document.getElementById('iconDiv').style;
        iconDiv.height = window.innerHeight/3.1+"px";
        let iconD = document.getElementById('icon').style;
        iconD.height = window.innerHeight/3.1+"px";
      }
      catch {
        ;
      }
    }
    window.addEventListener("resize", setHeight);
    return (
        <>
        <div id="start2">
        <div id="iconDiv" style={{ height: window.innerHeight / 3.1 + "px", top: '15px', width: '240px' }}>
          <img
            src={icon}
            id="icon"
            alt="Icon"
            style={{ height: window.innerHeight / 3.1 + "px", width: '240px', borderRadius: '21px' }}
          ></img>
        </div>
        <p id="desc" style={{top: '40px'}}>Make your To-Do List and get timely reminders</p>
        </div>
      </>
    )
  }
}
