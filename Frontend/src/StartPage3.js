import React, { Component } from 'react'
import './StartPage.css'

export default class StartPage3 extends Component {
    constructor()
    {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        let Div = document.getElementById('start3');
        this.props.setAnimation(Div.style);
    }

    handleClick() {
        this.props.navigate('/sign-in', true);
    }

  render() {
    const setHeight = () => {
      try {
        let iconDiv = document.getElementById('buttonDiv').style;
        iconDiv.top = window.innerHeight*0.10+"px";
      }
      catch {
        ;
      }
    }
    window.addEventListener("resize", setHeight);
    return (
        <>
        <div id='start3'>
        <p id="startIt" style={{top: '40px'}}>LET'S START!!</p>
        <div id="buttonDiv" style={{ top: window.innerHeight*0.10+"px"}}>
          <button type='button' id='startButton' class="btn btn-primary" onClick={this.handleClick}>
              <p id='buttonFont'>START</p>
          </button>
        </div>
        </div>
      </>
    )
  }
}