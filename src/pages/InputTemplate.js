import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

const DAY = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4
};
const TIME = {
  FIRST: 0,
  SECOND: 1,
  THIRD: 2,
  FORTH: 3,
  FIFTH: 4,
  SIXTH: 5,
  SEVENTH: 6,
  EIGHT: 7
};
const MIN_GRADE = 5;
const MAX_GRADE = 10;
const dummyData = [
  {
    subjectId: 1,
    title: "과목A",
    grade: 3,
    color: "#EF5350",
    lesson: [ // lesson안에는 총 3 타입의 수강 요일과 타임이 있습니다.
      [{
          day: DAY.MONDAY,
          time: [TIME.FIRST, TIME.SECOND]
        },
        {
          day: DAY.THURSDAY,
          time: [TIME.FIRST, TIME.SECOND]
        }
      ], // 월목 1교시가 한세트
      [{
          day: DAY.TUESDAY,
          time: [TIME.FIRST, TIME.SECOND]
        },
        {
          day: DAY.WEDNESDAY,
          time: [TIME.FIRST, TIME.SECOND]
        }
      ], // 수목 1교시가 한세트
      [{
          day: DAY.MONDAY,
          time: [TIME.THIRD, TIME.FORTH]
        },
        {
          day: DAY.FRIDAY,
          time: [TIME.THIRD, TIME.FORTH]
        }
      ]
    ]
  },
  {
    subjectId: 2,
    title: "과목B",
    grade: 3,
    color: "#E91E63",
    lesson: [
      [{
          day: DAY.WEDNESDAY,
          time: [TIME.THIRD, TIME.FORTH]
        },
        {
          day: DAY.FRIDAY,
          time: [TIME.THIRD, TIME.FORTH]
        }
      ],
      [{
          day: DAY.MONDAY,
          time: [TIME.FIFTH, TIME.SIXTH]
        },
        {
          day: DAY.TUESDAY,
          time: [TIME.FIRST, TIME.SECOND]
        }
      ],
      [{
          day: DAY.MONDAY,
          time: [TIME.FIFTH, TIME.SIXTH]
        },
        {
          day: DAY.FRIDAY,
          time: [TIME.THIRD, TIME.FORTH]
        }
      ]
    ]
  },
  {
    subjectId: 3,
    title: "과목C",
    grade: 2,
    color: "#BA68C8",
    lesson: [
      [{
        day: DAY.MONDAY,
        time: [TIME.FIFTH, TIME.SIXTH]
      }],
      [{
        day: DAY.TUESDAY,
        time: [TIME.SEVENTH, TIME.EIGHT]
      }],
      [{
        day: DAY.WEDNESDAY,
        time: [TIME.FIFTH, TIME.SIXTH]
      }]
    ]
  },
  {
    subjectId: 4,
    title: "과목D",
    grade: 2,
    color: "#7B1FA2",
    lesson: [
      [{
        day: DAY.WEDNESDAY,
        time: [TIME.FIRST, TIME.SECOND]
      }],
      [{
        day: DAY.THURSDAY,
        time: [TIME.SEVENTH, TIME.EIGHT]
      }],
      [{
        day: DAY.FRIDAY,
        time: [TIME.FIRST, TIME.SECOND]
      }]
    ]
  },
  {
    subjectId: 5,
    title: "과목E",
    grade: 2,
    color: "#3F51B5",
    lesson: [
      [{
        day: DAY.WEDNESDAY,
        time: [TIME.THIRD, TIME.FORTH]
      }],
      [{
        day: DAY.THURSDAY,
        time: [TIME.SEVENTH, TIME.EIGHT]
      }],
      [{
        day: DAY.FRIDAY,
        time: [TIME.THIRD, TIME.FORTH]
      }]
    ]
  },
  {
    subjectId: 6,
    title: "과목F",
    grade: 2,
    color: "#4527A0",
    lesson: [
      [{
        day: DAY.WEDNESDAY,
        time: [TIME.THIRD, TIME.FORTH]
      }],
      [{
        day: DAY.THURSDAY,
        time: [TIME.SEVENTH, TIME.EIGHT]
      }],
      [{
        day: DAY.FRIDAY,
        time: [TIME.THIRD, TIME.FORTH]
      }]
    ]
  },
  {
    subjectId: 7,
    title: "과목G",
    grade: 2,
    color: "#26C6DA",
    lesson: [
      [{
        day: DAY.WEDNESDAY,
        time: [TIME.THIRD, TIME.FORTH]
      }],
      [{
        day: DAY.THURSDAY,
        time: [TIME.SEVENTH, TIME.EIGHT]
      }],
      [{
        day: DAY.FRIDAY,
        time: [TIME.THIRD, TIME.FORTH]
      }]
    ]
  },
  {
    subjectId: 8,
    title: "과목H",
    grade: 2,
    color: "#00796B",
    lesson: [
      [{
        day: DAY.WEDNESDAY,
        time: [TIME.THIRD, TIME.FORTH]
      }],
      [{
        day: DAY.THURSDAY,
        time: [TIME.SEVENTH, TIME.EIGHT]
      }],
      [{
        day: DAY.FRIDAY,
        time: [TIME.THIRD, TIME.FORTH]
      }]
    ]
  }
];

class InputTemplate extends Component{

  constructor() {
    super();
    this.state = {
      dropdownMenu: [],
      alertMessage:"",
      currentGrade: 0,
      subjectDatas: [],
      selectedSubjects: [],
      isRedirectNextStep: false,
      exceptionTime: this._initArray()
    };
  }

  componentDidMount(){
    this._initSubject();
    this._onSelectSubject = this._onSelectSubject.bind(this);
    this._onClickRemove = this._onClickRemove.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state);
  }

  _initArray = () => {
    let array = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]

    return array;
  }

  _initSubject = () => {
    let dropdownMenu = this._getDropdownMenuItems();
    this.setState({dropdownMenu});
  }

  _getDropdownMenuItems = () => {
    let dropdownMenu = [];
    dummyData.forEach((e,i)=> {
      dropdownMenu.push({label:e.title+"("+e.grade+"학점)", value:e.subjectId, grade:e.grade});
    });
    return dropdownMenu;
  }

  _onSelectSubject = (selected) => {
    let {value, label} = selected;
    let {selectedSubjects, currentGrade, alertMessage} = this.state;
    let grade=this._getGradeBySubjectId(value);

    if(currentGrade+grade >= 21){
      alertMessage = "21학점 까지만 신청가능합니다.";
      this.setState({alertMessage});
      return;
    }

    if(selectedSubjects.find(({subjectId})=>subjectId===value)!==undefined){
      alertMessage = "중복된 과목을 신청하셨습니다.";
      this.setState({alertMessage});
      return;
    }

    alertMessage = `${label}을(를) 추가하였습니다.`;
    selectedSubjects.push({subjectName:label, subjectId:value, grade});
    currentGrade += grade;
    this.setState({selectedSubjects, alertMessage, currentGrade});
  }

  _onClickRemove = (subject) => {
    let {selectedSubjects, alertMessage, currentGrade} = this.state;
    let {subjectName, subjectId} = subject;
    selectedSubjects = selectedSubjects.filter(e=>e.subjectId!==subjectId);
    alertMessage = `${subjectName}을 삭제하였습니다.`;
    let grade = this._getGradeBySubjectId(subjectId);
    currentGrade -= grade;
    this.setState({selectedSubjects, alertMessage, currentGrade});
  }

  _onClickSubmit = () => {
    let {currentGrade, alertMessage} = this.state;
    if(currentGrade<MIN_GRADE || currentGrade>MAX_GRADE){
      alertMessage = "스케줄링을 위해선 18학점~21학점 사이로 선택해주세요.";
      this.setState({alertMessage});
      return;
    }

    alertMessage = "신청완료!";
    this.setState({alertMessage, isRedirectNextStep:true}, ()=>{
      console.log(this.state);
    });

  }

  _getGradeBySubjectId = (subjectId) => {
    let {dropdownMenu} = this.state;
    return dropdownMenu.find(e=>e.value===subjectId).grade;
  }

  _renderSubjectInputArea = () => {
    let {dropdownMenu, currentGrade} = this.state;
    return(
      <div>
      <h4>Step 1. <small>수강하고 싶은 과목을 15~18학점 사이로 선택해주세요.</small></h4>
        <Dropdown
          options={dropdownMenu}
          onChange={this._onSelectSubject}
          placeholder="시간표를 구성할 과목을 선택해주세요."
        />
        <ul>
          {this.state.selectedSubjects.map((e,i)=>{
            return(
                <li key={i} style={{marginTop:5, padding:5}}>
                  {e.subjectName}
                  <button class="btn btn-danger btn-sm" onClick={()=>this._onClickRemove(e)} style={{marginLeft:10}}>삭제</button>
                </li>
            )
          })}
        </ul>
        <div class="alert alert-info" role="alert">
          {`총 신청 학점 : ${currentGrade}`}
        </div>
        {this._renderAlertMessage()}
      </div>
    )
  }

  _renderExceptionTimeSeletor = () => {
    let rows = [1,2,3,4,5,6,7,8];
    let cols = [1,2,3,4,5,6];
    let {exceptionTime} = this.state;
    return(
      <div>
      <h4>Step 2. <small>비워두고 싶은 시간을 마킹하세요.</small></h4>
      <table class="table table-hover" style={{backgroundColor:"#fff"}}>
        <thead>
          <th>#</th>
          <th>월요일</th>
          <th>화요일</th>
          <th>수요일</th>
          <th>목요일</th>
          <th>금요일</th>
        </thead>
        <tbody>
        {
          rows.map((e,i) => {
            return(
              <tr>
              {
                cols.map((e2,i2)=>{
                return(
                  i2===0 ?
                  <td>{i+1}</td> :
                  <td
                    onClick={()=>this._onClickExceptionTime(i, i2-1)}
                    style={ exceptionTime[i][i2-1] == -1 ? {backgroundColor:"#E9573F"} : {} }
                  >
                  CLICK
                  </td>
                )
                })
              }
              </tr>
            );
          })
        }
        </tbody>
      </table>
      </div>
    );
  }

  _renderAlertMessage = () => {
    return (
      <p style={{color:"red", marginBottom:50}}>
        {this.state.alertMessage}
      </p>
    )
  }

  _onClickExceptionTime = (row, cols) => {
    let {exceptionTime} = this.state;
    exceptionTime[row][cols] = exceptionTime[row][cols] === -1 ? 0 : -1;
    this.setState({exceptionTime});
  }


  render() {
    let {subjectDatas, selectedSubjects, exceptionTime, isRedirectNextStep} = this.state;
    if(isRedirectNextStep){
      return(
        <Redirect
          to={{
            pathname:"/timetable",
            state: {subjectDatas:dummyData, selectedSubjects, exceptionTime}
          }}/>
      )
    }
    return (
      <div style={{padding:50}}>
        {this._renderSubjectInputArea()}
        {this._renderExceptionTimeSeletor()}
        <h4>Final Step. <small>아래 버튼을 누르시면 스케줄링을 시작합니다.</small></h4>
        <button class="btn btn-primary " onClick={this._onClickSubmit}>
          스케쥴링 시작
        </button>
      </div>

    );
  }
}
export default InputTemplate;
