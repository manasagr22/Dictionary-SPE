import React, { Component, useEffect } from "react";
import icon from "./res/dictionary.jpg";
import { Link } from "react-router-dom";
import "./SignUp.css";
import "./DoIt.css";
import Spinner from './Spinner';
import Alert from './Alert';
import data from './URL.json'
import AddPage from "./AddPage";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default class DoIt extends Component {
  constructor(props) {
    super(props);
    this.addTask = this.addTask.bind(this);
    this.setHeight = this.setHeight.bind(this);
    this.logout = this.logout.bind(this);
    this.getTasks = this.getTasks.bind(this);
    // this.expandWord = this.expandWord.bind(this);
    // this.shrinkWord = this.shrinkWord.bind(this);
    this.displayDictionary = this.displayDictionary.bind(this);
    this.searchForWord = this.searchForWord.bind(this);
    this.setAnimation = this.setAnimation.bind(this);
    this.clearAnimation = this.clearAnimation.bind(this);
    this.startScroll = this.startScroll.bind(this);
    this.stopScroll = this.stopScroll.bind(this);
    this.props.setStateData('popCount', 0);
    this.switch = this.switch.bind(this);
    this.searchingActive = this.searchingActive.bind(this);
    this.closeBox = this.closeBox.bind(this);
    this.removeElementFromClass = this.removeElementFromClass.bind(this);
    this.delContent = this.delContent.bind(this);
    this.Confirm = this.Confirm.bind(this);
    this.Cancel = this.Cancel.bind(this);
    this.state = {
      addActive: false,
      scrollId: null,
      disableButton: true,
      AddButtonDisable: true,
      searchSymbol: null,
      dictionaryActive: true,
    }
    this.scrollActive = 0;
    // this.searchSymbol = null;
  }

   async Confirm(id, Word, arr, page) {
    const word = Word;
    const email = this.props.data[1];
    var alert = document.getElementById("deleteBox").style;
    alert.display = "none";
    let bg = document.getElementById('DoItBackground').style;
    const PORT = process.env.PORT || 4000;
    if(page == 'Dictionary')
      var url = process.env.NODE_ENV === 'production' ? 'https://my-dictionary.onrender.com/api/auth/deleteWordDict' : `${data.URL}:${PORT}/api/auth/deleteWordDict`
    else
      var url = process.env.NODE_ENV === 'production' ? 'https://my-dictionary.onrender.com/api/auth/deleteWordDoc' : `${data.URL}:${PORT}/api/auth/deleteWordDoc`
    bg.filter = 'blur(2px)';
    this.props.setStateData('load', true);
    try {
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        word,
      }),
    }).then((res) => res.json());
  
    this.props.setStateData('load', false);
    bg.filter = '';
    if(result.status === "error") {
      this.props.alertFunc('danger', "Some Error Occurred!!!");
    }
    else {
      this.props.alertFunc('success', "Item Deleted!!");
      arr.splice(id, 1);
      this.removeDictionary(page);
      localStorage.setItem(this.props.data[1]+page, JSON.stringify(arr));
      // this.removeDictionary('Document');
      this.displayDictionary(page);
      // this.displayDictionary('Document');
    }
    this.setState({
      AddButtonDisable: false,
    })
  }
  catch {
    this.props.setStateData('load', false);
    bg.filter = '';
    this.props.alertFunc('danger', "Network Error Occurred!!!");
  }
   }

   Cancel() {
    var alert = document.getElementById("deleteBox").style;
    alert.display = "none";
   }

  delContent(id, word, arr, page) {
    var alert = document.getElementById("deleteBox").style;
    alert.display = "";
    let doAction = document.getElementById("doAction");
    let cancelAction = document.getElementById("cancelAction");
    doAction.onclick = () => this.Confirm(id, word, arr, page);
    cancelAction.onclick = () => this.Cancel();
  }

  isValidURL(data) {
    let link = data.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (link !== null) {
      if (
        data.indexOf("http://") === 0 ||
        data.indexOf("https://") === 0
      )
        return 1;
      else return 2;    // Append https:// to data
    } else return 0;
  };

  displayDictionary(page) {
    try {
    if(this.props.active[1] === true) {
      const taskContain = document.getElementById("TaskContain");
      if(JSON.parse(localStorage.getItem(this.props.data[1]+page)).length) {
        taskContain.style.display = 'grid';
      }
      else
        taskContain.style.display = 'none';
      const arr = JSON.parse(localStorage.getItem(this.props.data[1]+page));
      for(let i=0;i<arr.length;i++) {
        const card = document.createElement("div");
        const box = document.createElement("div");
        const content = document.createElement("div");
        const pCover = document.createElement("div");
        const h3_cover = document.createElement("div");
        const h2 = document.createElement("h2");
        const h3 = document.createElement("h3");
        const p = document.createElement("p");
        const task_contain = document.getElementById("TaskContain");

        const delButton = document.createElement("button");
        const delIcon = document.createElement("i");
  
        card.className = "card";
        box.className = "box";
        content.className = "content";
        pCover.className = "pCover";
        h3_cover.className = "hCover";
        delIcon.className = "delIcon material-icons";
        delButton.id = i;
        delButton.className = "delButton";
        delIcon.innerText = "delete";
        // task.style.maxWidth = "20rem";
        // task_font.className = "TaskFont card-text";
        if(i+1 < 10)
          h2.innerText = "0"+(i+1);
        else
          h2.innerText = i+1;
        h3.innerText = arr[i][0];

        delButton.onclick = () => {this.delContent(i, arr[i][0], arr, page)};
        // task.id = "Task"+i;
        // task_content.append(meaning);
        delButton.append(delIcon);
        box.append(delButton);
        box.append(h2);
        h3_cover.append(h3);
        content.append(h3_cover);

        var flag = this.isValidURL(arr[i][1]);
        if(flag == 0) {
          p.innerText = arr[i][1];
          pCover.append(p);  
        }
        else if(flag == 1) {
          let msg2 = arr[i][1];
          let anchorElement = document.createElement("a");
          anchorElement.href = msg2;
          anchorElement.title = msg2;
          anchorElement.target = "_blank";
          let link = document.createTextNode(msg2);
          anchorElement.appendChild(link);
          p.append(anchorElement);
        }
        else {
          let msg2 = "https://"+arr[i][1];
          let anchorElement = document.createElement("a");
          anchorElement.href = msg2;
          anchorElement.title = msg2;
          anchorElement.target = "_blank";
          let link = document.createTextNode(msg2);
          anchorElement.appendChild(link);
          p.append(anchorElement);
        }
        pCover.append(p);
        content.append(pCover);
        box.append(content);
        card.append(box);
        // task.append(task_content);
        // task_cover.append(task);
        task_contain.append(card);

      }
  
    //     let TaskC = document.querySelectorAll(".Task");
    // TaskC.forEach((Task) => {
    //   if(window.innerWidth > 768)
    //     Task.style.width = (window.innerWidth/2)-25 + "px";
    //   else
    //     Task.style.width = (window.innerWidth)-25 + "px";
    // });
    let TaskContentC = document.querySelectorAll('.TaskContent');
    TaskContentC.forEach((TaskContent) => {
      if(window.innerWidth > 768)
        TaskContent.style.width = (window.innerWidth/2)-(25+12)+"px";
      else
        TaskContent.style.width = (window.innerWidth)-(25+12)+"px";
    })
    // let TaskFontC = document.querySelectorAll('.TaskFont');
    // TaskFontC.forEach((TaskFont) => {
    //   if(window.innerWidth > 768)
    //     TaskFont.style.width = (window.innerWidth/6)-(25+12+38)+"px";
    //   else
    //     TaskFont.style.width = (window.innerWidth)-(25+12+38)+"px";
    // })
  }
    }
    catch (error){
      ;
    }
  }


  async getTasks(Email) {
    const email = Email;
  
    let bg = document.getElementById('DoItBackground').style;
    const PORT = process.env.PORT || 4000;
    let url = process.env.NODE_ENV === 'production' ? 'https://my-dictionary.onrender.com/api/auth/getDictionary' : `${data.URL}:${PORT}/api/auth/getDictionary`
    try {
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }).then((res) => res.json());
  
    if(result.status === "error") {
      this.props.alertFunc('danger', "Some Error Occurred!!!");
      this.props.active[0] = true;
    }
    else {
      localStorage.setItem(email+'Dictionary', JSON.stringify(result.dict));
      localStorage.setItem(email+'Document', JSON.stringify(result.document));
      this.props.active[1] = true;
      this.props.active[0] = true;
      this.props.alertFunc('success', "Updating Documents!");
      bg.filter = 'blur(2px)';
      this.props.setStateData('load', true);
      setTimeout(() => {
        this.removeDictionary('Dictionary');
        this.displayDictionary('Dictionary');
        this.props.setStateData('load', false);
        bg.filter = '';
      }, 1000);
    }
    this.setState({
      AddButtonDisable: false,
    })
  }
  catch {
    // this.props.setStateData('load', false);
    // bg.filter = '';
    this.props.alertFunc('danger', "Network Error Occurred!!!");
  }
  }


  removeDictionary(element) {
    try {
    const arr = JSON.parse(localStorage.getItem(this.props.data[1]+element));
    for(let i=0;i<arr.length;i++) {
      let card = document.querySelectorAll('.card');
      card.forEach((Card) => {
        Card.remove();
      })
    }
  }
  catch{
    ;
  }
  }

  addTask() {
    if(this.state.addActive)
    {
      document.getElementById('TaskContainer').style.display = "block";
      this.setState({
        addActive: false,
      }, () => {
        if(this.state.dictionaryActive)
          this.displayDictionary('Dictionary')
        else
          this.displayDictionary('Document');
      })
    }
    else
    {
    this.setState({
      addActive: true,
    }, () => {
      if(this.state.dictionaryActive)
        this.removeDictionary('Dictionary')
      else
        this.removeDictionary('Document');
    })
  }
  }

  logout() {
    localStorage.removeItem('Name');
    localStorage.removeItem('Email');
    localStorage.removeItem(this.props.data[1]+'Dictionary');
    localStorage.removeItem(this.props.data[1]+'Document');
    this.props.navigate('\sign-in', true);
  }

  setAnimation(element) {
    // element.animationDuration = "2.9s";
    element.transform = "translateY(-50px)";
    // element.transitionTimingFunction = "ease-in";
    // element.animationFillMode = "both";
    // element.animationName = "fadeIn";
  }

  clearAnimation(element) {
    // element.animationDuration = "";
    element.transform = "";
    // element.transitionTimingFunction = "";
    // element.animationFillMode = "";
    // element.animationName = "";
  }

  startScroll(scroll, word, card) {
    const interval = 1;
    var scrolled = 0;
    const task = document.getElementById("TaskContain");
    if(scroll > 0) {
    var id = setInterval(() => {
        task.scrollBy(0, 20);
        scrolled += 20
        if (scrolled >= scroll) {
            this.stopScroll(word, card);
        }
    }, interval);
  }
  else if(scroll < 0){
    var id = setInterval(() => {
      task.scrollBy(0, -20);
      scrolled -= 20
      if (scrolled <= scroll) {
          this.stopScroll(word, card);
      }
  }, interval);
  }
    return id;
}

stopScroll(word, card) {
    clearInterval(this.state.scrollId);
    setTimeout(() => {
      this.setAnimation(word);
      card.background = "#89a6ff";
    }, 200);
    setTimeout(() => {
      this.clearAnimation(word);
      card.background = "#232427";
    }, 650);
}

  searchForWord() {
    try {
      if(this.state.dictionaryActive)
        var page = 'Dictionary';
      else
        var page = 'Document';
    const arr = JSON.parse(localStorage.getItem(this.props.data[1]+page));
    const search = document.getElementById('search').value;
    const task = document.getElementById("TaskContain");
    var row = 0;
    var flag = false;
    for(let i=0;i<arr.length;i++) {
      if(search.toLowerCase() === arr[i][0].toLowerCase()) {
        flag = true;
        const elements = document.getElementsByClassName('box')
        const cards = document.getElementsByClassName('card')
        var word = elements[i].style;
        var card = cards[i].style;
        if(window.innerWidth <= 580)
          row = 1;
        else if((window.innerWidth > 580) && (window.innerWidth <= 1249))
          row = 2;
        else 
          row = 3;
        row = Math.floor(i/row);
        if(((row*369)-task.scrollTop) < 0) {
          this.scrollActive = 1;
          this.setState({
            scrollId: this.startScroll((row*369)-task.scrollTop, word, card)
          });
        }
        else if(((row*369)-task.scrollTop) > 0) {
            this.scrollActive = 1;
            this.setState({
              scrollId: this.startScroll((row*369)-task.scrollTop, word, card)
            });
        }
        else {
          this.scrollActive = 0;
        }

        if(this.scrollActive === 0) {
          setTimeout(() => {
            this.setAnimation(word);
            card.background = "#89a6ff";
          }, 200);
        setTimeout(() => {
          this.clearAnimation(word);
          card.background = "#232427";
        }, 650);
      }
        break;
      }
    }
    if(!flag)
      this.props.alertFunc('danger', "No Such Word Found!!!");
  }
  catch {
    ;
  }
  }

  closeBox() {
    try {
    const docs = document.querySelectorAll(".suggestionBox");
    docs.forEach(doc => {
      doc.remove();
    })
  }
  catch {
    ;
  }
  }

  removeElementFromClass(elem, currFocus) {
    try {
      elem[currFocus].classList.remove("elementActive");
    }
    catch{
      ;
    }
  }

  searchingActive() {
    var currFocus = -1;
    document.getElementById("search").addEventListener("input", () => {
      this.setHeight();
    try {
      if(this.state.dictionaryActive)
        var page = 'Dictionary';
      else
        var page = 'Document';
    this.closeBox();
    const arr = JSON.parse(localStorage.getItem(this.props.data[1]+page));
    const search = document.getElementById('search');
    const inputContainer = document.getElementById("inputContainer");

    if(search.value.length === 0) {
      this.setState({
        disableButton: true,
      })
      this.closeBox();
    }
    else
      this.setState({
        disableButton: false,
      })
    var box = document.createElement("div");
    box.className = "suggestionBox";
    box.id = "suggest";
    inputContainer.append(box);
    var found = false;
    for(let i=0;i<arr.length;i++) {
      if(arr[i][0].substr(0, search.value.length).toLowerCase() === search.value.toLowerCase()) {
        found = true;
        let element = document.createElement("div");
        element.className = "searchElements";
        element.innerHTML = "<strong>" + arr[i][0].substr(0, search.value.length) + "</strong>" + arr[i][0].substr(search.value.length, arr[i][0].length);

        element.addEventListener("click", () => {
          search.value = arr[i][0];
          this.closeBox();
        });
        box.append(element);
      }
    }
    if(!found) {
      let element = document.createElement("div");
      element.className = "searchElements";
      element.innerHTML = "<strong>Not Found</strong>";
      box.append(element);
    }
    try {
      if(window.innerWidth <= 768)
        box.style.left = "36px";
      else
        box.style.left = 0;
    }
    catch {
      ;
    }
    if(search.value.length === 0)
      this.closeBox();
    }
    catch {
      ;
    }
  })

  document.getElementById("search").addEventListener("keydown", (e) => {
    try {
      let search = document.getElementById('search');
      if(search.value.length === 0)
        this.setState({
          disableButton: true,
        })
      else
        this.setState({
          disableButton: false,
        })
    var elem = document.querySelectorAll(".searchElements");
    if(e.key === "ArrowDown") {
      this.removeElementFromClass(elem, currFocus);
      currFocus += 1;
      if(currFocus > elem.length-1)
        currFocus = 0;
      elem[currFocus].classList.add("elementActive");
    }
    else if(e.key === "ArrowUp") {
      this.removeElementFromClass(elem, currFocus);
        currFocus -= 1;
        if(currFocus < 0)
          currFocus = elem.length-1;
        elem[currFocus].classList.add("elementActive");
    }
    else if(e.key === "Enter") {
      e.preventDefault();
      elem[currFocus].click();
    }
  }
  catch {
    ;
  }
  })
}


  componentDidMount() {
    if(window.performance.navigation.type !== 0) {
      if(localStorage.getItem('Email')) {
        this.props.navigate('/do-it', true);
      }
      else {
        this.props.navigate('/', true);
      }
    }
    if(localStorage.getItem('Email')) {
      this.props.active[1] = true;
      this.props.active[0] = true;
      this.props.data[1] = localStorage.getItem('Email');
      let p1 = new Promise((resolve, reject) => {
        this.getTasks(this.props.data[1]);
        resolve(true);
      })
      this.displayDictionary('Dictionary');
    }
    else
      this.props.navigate('/', true);

    // const inp = document.getElementById('search');
    // inp.addEventListener("keydown", this.setHeight);
    // inp.addEventListener('keyup', (e) => {
    //   let search = document.getElementById('search');
    //   if(search.value === "")
    //     this.setState({
    //       disableButton: true,
    //     })
    //   else
    //     this.setState({
    //       disableButton: false,
    //     })
    // });

    this.searchingActive();


    const TaskContainer = document.getElementById("TaskContainer").style;
    const TaskContain = document.getElementById('TaskContain').style;
    const NameFont = document.getElementById("NameFont").style;
    TaskContain.top = (window.innerHeight - 74)/8 + "px";
    TaskContain.maxHeight = ((window.innerHeight - 74) - (window.innerHeight - 74)/4) + "px";

    if(window.innerWidth > 768) {
      NameFont.width = (window.innerWidth-(351+39+5+40))+"px";
    }
    else if(window.innerWidth <= 768 && window.innerWidth > 500) {
      NameFont.width = (window.innerWidth-(306+39+5))+"px";
    }
    else {
      NameFont.width = (window.innerWidth-((0.6*window.innerWidth)+39+5))+"px";
    }
    if(window.innerWidth > 768)
      this.setState({searchSymbol: false});
    else
      this.setState({searchSymbol: true});
    if(window.innerWidth <= 490) {
      TaskContainer.maxWidth = window.innerWidth+"px"
      TaskContainer.position = 'absolute';
      TaskContain.width = TaskContainer.maxWidth;
      TaskContainer.top = "123px";
      TaskContain.top = "0px";
      TaskContain.maxHeight = (window.innerHeight - 100) + "px";
      try {
        let suggest = document.getElementById("suggest").style;
        suggest.left = "36px";
      }
      catch {
        ;
      }
    }
    else if((window.innerWidth > 490) && (window.innerWidth <= 768)) {
      TaskContain.width = window.innerWidth + "px";
      TaskContainer.maxWidth = window.innerWidth+"px"
      TaskContainer.position = 'absolute';
      TaskContainer.top = "123px";
      TaskContain.top = "0px";
      TaskContain.maxHeight = (window.innerHeight - 100)+"px";
      try {
        let suggest = document.getElementById("suggest").style;
        suggest.left = "36px";
      }
      catch {
        ;
      }
    }
    else if((window.innerWidth > 768) && (window.innerWidth <= 840)) {
      TaskContainer.maxWidth = window.innerWidth/1.2+"px"
      TaskContainer.position = 'relative';
      TaskContainer.top = "0px";
      TaskContain.width = TaskContainer.maxWidth;
      try {
        let suggest = document.getElementById("suggest").style;
        suggest.left = "0px";
      }
      catch {
        ;
      }
    }
    else if((window.innerWidth > 840) && (window.innerWidth <= 920)) {
      TaskContainer.position = 'relative';
      TaskContainer.top = "0px";
      TaskContainer.maxWidth = window.innerWidth/1.2+"px"
      TaskContain.width = TaskContainer.maxWidth;
      try {
        let suggest = document.getElementById("suggest").style;
        suggest.left = "0px";
      }
      catch {
        ;
      }
    }
    else if((window.innerWidth > 920) && (window.innerWidth <= 1440)) {
      TaskContainer.position = 'relative';
      TaskContainer.top = "0px";
      TaskContainer.maxWidth = window.innerWidth/1.3+"px"
      TaskContain.width = TaskContainer.maxWidth;
      try {
        let suggest = document.getElementById("suggest").style;
        suggest.left = "0px";
      }
      catch {
        ;
      }
    }
    else {
      TaskContainer.position = 'relative';
      TaskContainer.top = "0px";
      TaskContainer.maxWidth = window.innerWidth/1.5+"px"
      TaskContain.width = TaskContainer.maxWidth;
      try {
        let suggest = document.getElementById("suggest").style;
        suggest.left = "0px";
      }
      catch {
        ;
      }
    }
    
    window.onpopstate = () => {
      if(this.props.state.popCount === 0)
      {
        this.props.setStateData('popCount', 1);
        window.history.pushState({}, undefined, "");
        this.props.navigate(-1, true);
      }
    }
  }

  switch() {
    const sw = document.getElementById("MainSwitch");
    const span = document.getElementById("spanning").style;
    const font = document.getElementsByClassName("MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3");
    const search = document.getElementById("search");
    this.closeBox();
    search.value = "";
    if(sw.className === "MuiButtonBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary PrivateSwitchBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked css-1nobdqi") {
      span.borderRadius = "13px";
      span.backgroundColor = "rgb(0, 0, 255)";
      span.opacity = 1;
      span.transition = "background-color 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms";
      font[0].style.color = "rgb(0, 0, 255)";
      font[1].style.color = "white";
      sw.className = "MuiButtonBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary PrivateSwitchBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary css-1nobdqi";
      this.setState({dictionaryActive: false})
      if(!this.state.addActive) {
        this.removeDictionary('Dictionary');
        this.displayDictionary('Document');
      }
    }
    else {
      span.backgroundColor = "rgb(46, 202, 69)";
      span.opacity = 1;
      span.border = '0px none';
      font[0].style.color = "white";
      font[1].style.color = "rgb(46, 202, 69)";
      sw.className = "MuiButtonBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary PrivateSwitchBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked css-1nobdqi";
      this.setState({dictionaryActive: true})
      if(!this.state.addActive) {
        this.removeDictionary('Document');
        this.displayDictionary('Dictionary');
      }
    }
  }

  setHeight() {
    try {
    let MainPage = document.getElementById("DoItBackground").style;
    // let MainPageC = document.getElementById("DoItContainer").style;
    MainPage.width = window.innerWidth + "px";
    MainPage.height = window.innerHeight + "px";
    // MainPageC.width = window.innerWidth + "px";
    const TaskContainer = document.getElementById("TaskContainer").style;
    const TaskContain = document.getElementById('TaskContain').style;
    TaskContain.top = (window.innerHeight - 74)/8 + "px";
    TaskContain.maxHeight = ((window.innerHeight - 74) - (window.innerHeight - 74)/4) + "px";
    const NameFont = document.getElementById("NameFont").style;

    if(window.innerWidth > 768) {
      NameFont.width = (window.innerWidth-(351+39+5+40))+"px";
    }
    else if(window.innerWidth <= 768 && window.innerWidth > 500) {
      NameFont.width = (window.innerWidth-(306+39+5))+"px";
    }
    else {
      NameFont.width = (window.innerWidth-((0.6*window.innerWidth)+39+5))+"px";
    }

    if(window.innerWidth > 768)
      this.setState({searchSymbol: false});
    else
      this.setState({searchSymbol: true});

      if(window.innerWidth <= 490) {
        TaskContainer.maxWidth = window.innerWidth+"px"
        TaskContainer.position = 'absolute';
        TaskContain.width = TaskContainer.maxWidth;
        TaskContainer.top = "123px";
        TaskContain.top = "0px";
        TaskContain.maxHeight = (window.innerHeight - 100) + "px";
        try {
          let suggest = document.getElementById("suggest").style;
          suggest.left = "36px";
        }
        catch {
          ;
        }
      }
      else if((window.innerWidth > 490) && (window.innerWidth <= 768)) {
        TaskContain.width = window.innerWidth + "px";
        TaskContainer.maxWidth = window.innerWidth+"px"
        TaskContainer.position = 'absolute';
        TaskContainer.top = "123px";
        TaskContain.top = "0px";
        TaskContain.maxHeight = (window.innerHeight - 100)+"px";
        try {
          let suggest = document.getElementById("suggest").style;
          suggest.left = "36px";
        }
        catch {
          ;
        }
      }
      else if((window.innerWidth > 768) && (window.innerWidth <= 840)) {
        TaskContainer.maxWidth = window.innerWidth/1.2+"px"
        TaskContainer.position = 'relative';
        TaskContainer.top = "0px";
        TaskContain.width = TaskContainer.maxWidth;
        try {
          let suggest = document.getElementById("suggest").style;
          suggest.left = "0px";
        }
        catch {
          ;
        }
      }
      else if((window.innerWidth > 840) && (window.innerWidth <= 920)) {
        TaskContainer.position = 'relative';
        TaskContainer.top = "0px";
        TaskContainer.maxWidth = window.innerWidth/1.2+"px"
        TaskContain.width = TaskContainer.maxWidth;
        try {
          let suggest = document.getElementById("suggest").style;
          suggest.left = "0px";
        }
        catch {
          ;
        }
      }
      else if((window.innerWidth > 920) && (window.innerWidth <= 1440)) {
        TaskContainer.position = 'relative';
        TaskContainer.top = "0px";
        TaskContainer.maxWidth = window.innerWidth/1.3+"px"
        TaskContain.width = TaskContainer.maxWidth;
        try {
          let suggest = document.getElementById("suggest").style;
          suggest.left = "0px";
        }
        catch {
          ;
        }
      }
      else {
        TaskContainer.position = 'relative';
        TaskContainer.top = "0px";
        TaskContainer.maxWidth = window.innerWidth/1.5+"px"
        TaskContain.width = TaskContainer.maxWidth;
        try {
          let suggest = document.getElementById("suggest").style;
          suggest.left = "0px";
        }
        catch {
          ;
        }
      }
  }
    catch {
      ;
    }
  }

  render() {
    window.addEventListener("resize", this.setHeight);
    if(localStorage.getItem('Name'))
      this.props.data[0] = localStorage.getItem('Name');
    if(localStorage.getItem('Email'))
      this.props.data[1] = localStorage.getItem('Email');
    else
      this.props.navigate('/', true);
    const name = this.props.data[0];
    const email = this.props.data[1];
    // if(window.innerWidth > 768)
    //   this.searchSymbol = false;
    // else
    //   this.searchSymbol = true;
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
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  {/* <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button> */}
  <img src={icon} alt="Icon" id="IconMain"></img>

  <div class="collapse navbar-collapse" id="navbarTogglerDemo03" style={{display: 'flex'}}>
    <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
      <li class="nav-item active">
      <p id="NameFont">
        {name}
      </p>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0" id="searchButton" autoComplete="off">
      <div id="inputContainer">
      <input class="form-control mr-sm-2" id="search" type="search" placeholder="Search" aria-label="Search" style={{marginRight: (window.innerWidth <= 768 ? "27px" : "6px")}} required/>
      </div>
      {!this.state.searchSymbol && <button class=" Searching btn btn-outline-success my-2 my-sm-0" type="button" onClick={this.searchForWord} disabled={this.state.disableButton}>Search</button>}
      {this.state.searchSymbol && <button type="button" disabled={this.state.disableButton} onClick={this.searchForWord} className="Searching searchIcon"><span class="material-symbols-outlined">search</span></button>}
      <button type="button" id="logout" onClick={this.logout}><i className="logout material-icons"></i></button>
    </form>
  </div>
</nav>
{this.props.state.alert !== null ? <Alert alert={this.props.state.alert}/> : undefined}
<label class="MuiFormControlLabel-root MuiFormControlLabel-labelPlacementEnd css-kswqkt">
<span class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3" style={{color: 'white'}}>Documents</span>
<span class="MuiSwitch-root MuiSwitch-sizeMedium css-4pp1z">
  <span class="MuiButtonBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary PrivateSwitchBase-root MuiSwitch-switchBase MuiSwitch-colorPrimary Mui-checked css-1nobdqi" id="MainSwitch">
    <input class="PrivateSwitchBase-input MuiSwitch-input css-1m9pwf3" type="checkbox" checked="" onClick={this.switch}/>
      <span class="MuiSwitch-thumb css-19gndve"></span>
      </span>
      <span class="MuiSwitch-track css-g5sy4h" id="spanning"></span>
        </span>
        <span class="MuiTypography-root MuiTypography-body1 MuiFormControlLabel-label css-9l3uo3" style={{color: 'rgb(46, 202, 69)'}}>Dictionary</span>
        </label>
    
    <div class='dialog-ovelay' id="deleteBox" style={{display: 'none'}}>
      <div class='dialog'>
        <header>
          <h3>Delete</h3>
            <i class='fa fa-close'></i>
        </header>
        <div class='dialog-msg'>
          <p>Are you sure you want to delete?</p>
        </div>
        <footer>
          <div class='controls'>
            <button class='button button-danger' id="doAction">Yes</button>
            <button class='button button-default' id='cancelAction'>Cancel</button>
          </div>
        </footer>
      </div>
    </div>


<section id="TaskContainer">
  <div style={{display: 'block', margin: 'block'}}>
        <div
        id="TaskContain"
        style={{paddingRight: '23px'}}
        // style={{ maxHeight: window.innerHeight - 78 + "px", width: (window.innerWidth <= 768 ? window.innerWidth +"px" : (window.innerWidth/2) +"px"), left: (window.innerWidth > 768) ? window.innerWidth/4+"px" : undefined}}
      >
        {/* <div id="TaskCover"></div> */}
      </div>
      </div>
      </section>
        {this.state.addActive === true ? <AddPage setHeight={this.setHeight} state={this.props.state} setData={this.props.setStateData} alertFunc={this.props.alertFunc} active={this.props.active} data={this.props.data} dictionaryActive={this.state.dictionaryActive}/> : undefined}
      </div>
      <button class="MuiButtonBase-root MuiFab-root MuiFab-circular MuiFab-sizeSecondary MuiFab-secondary css-1efuce" id="AddButton" tabindex="0" type="button" aria-label="add" disabled={this.state.AddButtonDisable} onClick={this.addTask}>
      {/* <Fab size="secondary" color="secondary" aria-label="add" onClick={this.addTask}> */}
        {this.state.addActive ? <i className="closeIcon material-icons"></i>: <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>}
        <span class="MuiTouchRipple-root css-w0pj6f"></span>
      {/* </Fab> */}
      </button>
      </>
    );
  }
}