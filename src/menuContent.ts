// class CourseInfo {
//   fullName: string;
//   callName: string;
//   state: boolean;
//   id: number;

//   constructor(fullName: string, callName: string, state: boolean, id: number) {
//     this.fullName = fullName;
//     this.callName = callName;
//     this.state = state;
//     this.id = id;
//   }
// }

// // グローバル配列の型定義
// const courseInfoList: CourseInfo[] = [];

// // 2. DOM操作の型安全性を確保
// function loadCourseInfo(allDivs: NodeListOf<Element>, targetList: [string, string][]) {
//   allDivs.forEach((div, index) => {
//     // divをHTMLElementとして扱う
//     const htmlDiv = div as HTMLElement;
//     htmlDiv.id = index.toString();

//     const header = htmlDiv.querySelector('.media-heading');
//     const headerText = header?.textContent;

//     if (headerText) {
//       const courseName = headerText.trim();
//       const course = new CourseInfo(courseName, courseName, false, index);

//       for (const element of targetList) {
//         if (courseName === element[0]) {
//           course.callName = element[1];
//           course.state = true;
//           break;
//         }
//       }
//       courseInfoList.push(course);
//     }
//   });
// }

// function ReflectToWell() {
//   const saveList: [string, string][] = [];

//   for (const element of courseInfoList) {
//     const div = document.getElementById(element.id.toString());
//     const header = div?.querySelector('.media-heading') as HTMLElement | null;

//     if (div && header) {
//       header.innerHTML = (header.textContent || "").replaceAll(element.fullName, element.callName);
      
//       const parent = div.parentElement;
//       if (parent) {
//         parent.style.display = element.state === false ? "none" : "";
//       }

//       if (element.state) {
//         saveList.push([element.fullName, element.callName]);
//       }
//     }
//   }

//   chrome.storage.sync.set({ myCourseList: saveList }, () => {
//     console.log('設定が保存されました。');
//   });
// }

// // DOM作成関数の引数に型を指定
// function createAddElement<K extends keyof HTMLElementTagNameMap>(
//   mode: 'prepend' | 'append',
//   tagName: K,
//   parent: HTMLElement,
//   childClass: string,
//   childTextContent: string | null
// ): HTMLElementTagNameMap[K] {
//   const child = document.createElement(tagName);
//   child.className = childClass;
//   if (childTextContent !== null) {
//     child.textContent = childTextContent;
//   }
  
//   if (mode === 'prepend') {
//     parent.prepend(child);
//   } else {
//     parent.appendChild(child);
//   }
//   return child;
// }


// const AllWells = document.querySelectorAll('.well');
// const container = document.querySelector('.content') as HTMLElement;
// container.classList.add("row","flex")
// container.innerHTML = ""
// AllWells.forEach((element) =>{
//     const div = document.createElement("div")
//     div.className = "col-lg-4 col-sm-6 col-xs-12";

//     const well = element as HTMLElement;

//     well.style.position = 'relative';
//     const deleteBtn = document.createElement("div")
//     deleteBtn.style.cssText = `
//             position: absolute;
//             top: 0;
//             left: 0;
//             border: 1px solid black;
//             padding: 5px;
//     `
//     deleteBtn.textContent = "消す"
//     well.appendChild(deleteBtn)
//     div.appendChild(well)
//     container.appendChild(div)
//     deleteBtn.addEventListener("click", () =>{div.style.display = "none"})
// })
// console.log(AllWells)