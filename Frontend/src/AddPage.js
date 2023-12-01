import React, { Component } from 'react'
import './AddPage.css'
import Alert from './Alert';
import Spinner from "./Spinner";
import data from './URL.json'
import SpinnerVerify from './SpinnerVerify';

export default class AddPage extends Component {
    constructor(props){
        super(props);
        this.setHeight = this.setHeight.bind(this);
        this.addPage = this.addPage.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.getMeaningAutomatically = this.getMeaningAutomatically.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.state = {
          spinnerActive: false,
        }
    }

    async addPage(event) {
      event.preventDefault();
      const word = document.getElementById('name').value;
      const meaning = document.getElementById('description').value;
      const email = this.props.data[1];
      if(this.props.dictionaryActive) {
        var mode = 'Dictionary';
      }
      else {
        var mode = 'Document';
      }

      let bg = document.getElementById('DoItBackground').style;
      const PORT = process.env.PORT || 4000;
      if(this.props.dictionaryActive)
        var url = process.env.NODE_ENV === 'production' ? 'https://my-dictionary.onrender.com/api/auth/addPage' : `${data.URL}:${PORT}/api/auth/addPage`
      else
        var url = process.env.NODE_ENV === 'production' ? 'https://my-dictionary.onrender.com/api/auth/addDoc' : `${data.URL}:${PORT}/api/auth/addDoc`
      bg.filter = 'blur(2px)';
      this.props.setData('load', true);
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          word,
          meaning,
        }),
      }).then((res) => res.json());

      this.props.setData('load', false);
      bg.filter = '';
      if (result.status === "ok") {
        this.props.alertFunc('success', 'Word Added Successfully!!!');
        var a = [word, meaning];
        console.log(mode)
        var b = JSON.parse(localStorage.getItem(email+mode));
        b.splice(b.length, 0, a);
        if(!b) {
          localStorage.setItem(email+mode, JSON.stringify(a));
          this.props.active[1] = true;
        }
        else {
          localStorage.setItem(email+mode, JSON.stringify(b));
        }
        let w = document.getElementById('name');
        let textBox = document.getElementById('description');
        textBox.value = '';
        w.value = '';
      } else if(result.status === "Exists"){
        this.props.alertFunc('danger', "Word Already Exists!!!");
        let w = document.getElementById('name');
        let textBox = document.getElementById('description');
        textBox.value = '';
        w.value = '';
      }
      else if(result.status === "error")
        this.props.alertFunc('danger', "Unable to Add Word!!!");
    }

    async getMeaningAutomatically() {
      const word = document.getElementById('name').value.toLowerCase();
      let textBox = document.getElementById('description');
      textBox.value = '';
      if(word === "")
        this.props.alertFunc('danger', "Word cannot be Empty!!!");
      else {
      let bg = document.getElementById('DoItBackground').style;
      const PORT = process.env.PORT || 4000;
      let url = process.env.NODE_ENV === 'production' ? 'https://my-dictionary.onrender.com/api/auth/getMeaning' : `${data.URL}:${PORT}/api/auth/getMeaning`
      this.setState({spinnerActive: true})
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word,
        }),
      }).then((res) => res.json());

      this.setState({spinnerActive: false})
      if (result.status === "error") {
        this.props.alertFunc('danger', "Unable to get Meaning!!!");
      }
      else {
        for(let i=0;i<result.status.length;i++) {
          let textBox = document.getElementById('description');
          textBox.value += `${i+1}. `+result.status[i];
          textBox.value += '\n\n';
        }
      } 
    }
  }

    authenticate() {
      const form = document.getElementById('AddTask')
      form.addEventListener('submit', this.addPage);
    }

    clearAll() {
      let word = document.getElementById('name');
      let textBox = document.getElementById('description');
      textBox.value = '';
      word.value = '';
    }

    componentDidMount() {
        let add = document.getElementById('AddPage').style;
        let addPage = document.getElementById('AddPageContainer').style
        add.width = window.innerWidth/1.3+"px";
        add.height = window.innerHeight+"px";
        addPage.width = window.innerWidth/1.3+"px";
        addPage.height = window.innerHeight+"px";
        addPage.left = (window.innerWidth-(window.innerWidth/1.3))/2+"px"
    }

    setHeight() {
        try{
        let add = document.getElementById('AddPage').style;
        let addPage = document.getElementById('AddPageContainer').style
        add.width = window.innerWidth/1.3+"px";
        add.height = window.innerHeight-(75+105)+"px";
        addPage.width = window.innerWidth/1.3+"px";
        addPage.height = window.innerHeight+"px";
        addPage.left = (window.innerWidth-(window.innerWidth/1.3))/2+"px"
        }
        catch{
            ;
        }
      }

  render() {
    window.addEventListener("resize", this.setHeight);
    try {
      let taskContainer = document.getElementById('TaskContainer');
      taskContainer.style.display = 'none';
    }
    catch {
      ;
    }
    return (
      <>
      {this.props.state.load && <Spinner/>}
        <div id='AddPageContainer' style={{display: 'block', position: 'absolute', top: '60px'}}>
        <p id='AddFont'>Add Word</p>
      <div id='AddPage'>
          <form id="AddTask" onsubmit="event.preventDefault()" autoComplete="off">
          <div className="AddForm">
                  <input
                    type="text"
                    id="name"
                    className='AddPageInput'
                    placeholder="Enter the Word"
                    required
                  />
                  {this.state.spinnerActive === true ? <SpinnerVerify/> : undefined}
                </div>
                <div className="AddForm" id="Automated">
                  <button type="button" id="submit" onClick={this.getMeaningAutomatically} style={{fontSize: "18px"}} className="btn btn-primary">Google Search</button>
                </div>
                <div className="AddForm">
                  <textarea
                    type="text"
                    id="description"
                    className='AddPageInput'
                    placeholder="Enter the Meaning"
                    required
                  />
                </div>
                <div className="AddForm" style={{display: 'flex'}}>
                <button type="submit" name="submit" id="submit" class="form-submit btn btn-primary" onClick={this.authenticate}>Add</button>
                <button type="button" id="submit" class="form-submit btn btn-primary" onClick={this.clearAll}>Clear All</button>
                </div>
          </form>
      </div>
      </div>
      </>
    )
  }
}