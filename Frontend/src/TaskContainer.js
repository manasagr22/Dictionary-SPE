// import React, { Component, useEffect } from 'react'

// export default class TaskContainer extends Component {

//   constructor(props){
//     super(props);
//     this.setHeight = this.setHeight.bind(this);
//     this.expandWord = this.expandWord.bind(this);
//     this.shrinkWord = this.shrinkWord.bind(this);
//     this.displayDictionary = this.displayDictionary.bind(this);
// }

// componentDidUpdate() {
//   this.displayDictionary();
// }

// displayDictionary() {
//   try {
//   if(this.props.active[1] === true) {
//     const arr = JSON.parse(localStorage.getItem('Dictionary'));
//     console.log(arr);
//     for(let i=0;i<arr.length;i++) {
//       const task_cover = document.createElement("div");
//       const task = document.createElement("div");
//       const task_content = document.createElement("div");
//       const task_font = document.createElement("p");
//       const design = document.createElement("div");
//       const button = document.createElement("button");
//       const button_i = document.createElement("i");
//       const task_contain = document.getElementById("TaskContain");

//       task_cover.className = i;
//       task.className = "Task";
//       task_content.className = "TaskContent";
//       task_font.className = "TaskFont";
//       design.className = "design";
//       button.className = "expandMore " + i;
//       button_i.className = "expandMore material-icons " + i;
//       button.type = "button";

//       task_font.innerText = arr[i][0];
//       task.id = i;
//       button_i.style.color = "black";
//       button_i.innerHTML = "&#xe5cf";

//       button.onclick = () => this.expandWord(arr, i);
//       button.appendChild(button_i);
//       task.append(design);
//       task_content.append(task_font);
//       task_content.append(button);
//       task.append(task_content);
//       task_cover.append(task);
//       task_contain.append(task_cover);
//     }

//       let TaskC = document.querySelectorAll(".Task");
//   TaskC.forEach((Task) => {
//     Task.style.width = window.innerWidth-25 + "px";
//   });
//   let TaskContentC = document.querySelectorAll('.TaskContent');
//   TaskContentC.forEach((TaskContent) => {
//     TaskContent.style.width = window.innerWidth-(25+12)+"px";
//   })
//   let TaskFontC = document.querySelectorAll('.TaskFont');
//   TaskFontC.forEach((TaskFont) => {
//     TaskFont.style.width = window.innerWidth-(25+12+38)+"px";
//   })
// }
//   }
//   catch {
//     ;
//   }
// }

//     componentDidMount() {
//       this.displayDictionary();
//   }

//     setHeight() {
//         try{
//         let TaskContain = document.getElementById("TaskContain").style;
//         TaskContain.height = window.innerHeight - 78 + "px";
//         TaskContain.width = window.innerWidth + "px";
//         }
//         catch{
//             ;
//         }
//     }

//     expandWord(arr, i) {
//       const task_covers = document.getElementsByClassName(i)
//       const task_meaning = document.createElement("div");
//       task_meaning.style.width = window.innerWidth-25 + "px";
//       task_meaning.className = "TaskMeaning " + i;
//       const task_font = document.createElement("p");
//       task_font.className = "TaskFont1";
//       task_font.innerText = arr[i][1];
//       task_meaning.append(task_font);
//       task_covers[0].append(task_meaning);
//       task_covers[1].onclick = () => this.shrinkWord(arr, i);
//       task_covers[2].innerHTML = "&#xe5ce";
//     }

//     shrinkWord(arr, i) {
//       let task_covers = document.getElementsByClassName(i)
//       task_covers[1].onclick = () => this.expandWord(arr, i);
//       task_covers[2].innerHTML = "&#xe5cf";
//       task_covers[3].remove();
//     }

//   render() {
//       window.addEventListener('resize', this.setHeight);
//       this.displayDictionary();
//       console.log("hello world1!!!...");
//     return (
//         <div
//         id="TaskContain"
//         style={{ height: window.innerHeight - 78 + "px", width: window.innerWidth+"px" }}
//       >
//       </div>
//     )
//   }
// }
