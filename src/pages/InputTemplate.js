import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import * as Api from '../api/Api';
import { ToastStore } from 'react-toasts';

/*
  신청 가능 학점 범위 설정
*/
const MIN_GRADE = 18;
const MAX_GRADE = 21;

/*
  서비스 버전인지 로컬 개발버전인지 확인
  개발 버전은 로컬 더미 데이터 사용
  서비스 버전은 API 서버에서 데이터 취득

*/
// const MODE_TYPE = {LOCAL:"local", PUBLIC:"public"};
// const MODE = MODE_TYPE.PUBLIC;

/*
  로컬 버전인 경우 더미 데이터 사용
*/
// const DUMMY_DATA = require('../dummyData.json');



/*
  사용자의 입력을 받는 템플릿
*/
class InputTemplate extends Component{

  constructor(props) {
    super(props);
    this.state = {
      dropdownMenu: [],
      alertMessage:"",
      currentGrade: 0,
      subjectGuideDatas: [],
      subjectDatas: [],
      selectedSubjects: [],
      isRedirectNextStep: false,
      exceptionTime: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ]
    };
  }

  componentDidMount(){

    if(this.props.location.state){
        this.setState(this.props.location.state);
    }
    else{
      this._requestSubjectDatas()
      .then(subjectDatas=>this.setState({subjectDatas}))
      .then(()=>this._requestSubjectGuideDatas())
      .then(subjectGuideDatas=>this.setState({subjectGuideDatas}))
      .then(()=>this._initDropdownMenu())
      .catch(e=>console.error(e));
    }

    this._onSelectSubject = this._onSelectSubject.bind(this);
    this._onClickRemove = this._onClickRemove.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
  }


  // 과목 데이터 불러오기
  _requestSubjectDatas = () => {
    return new Promise((resolve,reject) => {
      fetch(Api.getSubjects())
      .then(res=>resolve(res.json()))
      .catch(e=>reject(e));
    });
  }

  // 과목 설명 데이터 불러오기
  _requestSubjectGuideDatas = () => {
    return new Promise((resolve, reject) => {
      fetch(Api.getSubjectsGuide())
      .then(res=>resolve(res.json()))
      .catch(e=>reject(e));
    });
  }

  // 과목 드롭 다운 메뉴 초기화
  _initDropdownMenu = () => {
    let dropdownMenu = [];
    this.state.subjectDatas.forEach((e,i)=> {
      dropdownMenu.push({label:e.title+"("+e.grade+"학점)", value:e.subjectId, grade:e.grade});
    });
    this.setState({dropdownMenu});
  }

  /*
    과목 추가시 클릭 이벤트
    총 신청 학점이 계산되고 dropdown엔 추가한 항목이 삭제된다.
  */
  _onSelectSubject = (selected) => {
    let {value, label} = selected;
    let {selectedSubjects, currentGrade, alertMessage, dropdownMenu} = this.state;
    let grade=this._getGradeBySubjectId(value);

    if(currentGrade+grade >= 21){
      alertMessage = "21학점 까지만 신청가능합니다.";
      this.setState({alertMessage},()=>ToastStore.error(alertMessage));
      return;
    }

    if(selectedSubjects.find(({subjectId})=>subjectId===value)!==undefined){
      alertMessage = "중복된 과목을 신청하셨습니다.";
      this.setState({alertMessage}, ()=>ToastStore.error(alertMessage));
      return;
    }
    alertMessage = `${label}을(를) 추가하였습니다.`;
    selectedSubjects.push({subjectName:label, subjectId:value, grade});
    let updatedDropdownMenu = dropdownMenu.filter(e=>e.value !== value);
    let updatedCurrentGarde = currentGrade+grade;

    this.setState({selectedSubjects,
    alertMessage,
    currentGrade:updatedCurrentGarde,
    dropdownMenu:updatedDropdownMenu},
    ()=>ToastStore.success(alertMessage+` (현재학점 : ${this.state.currentGrade})`));
  }

  /*
    과목 삭제시 클릭 이벤트
    총 신청 학점이 누산되고 dropdown엔 삭제한 항목이 다시 추가된다.
  */
  _onClickRemove = (subject) => {
    let {selectedSubjects, alertMessage, currentGrade,dropdownMenu} = this.state;
    let {subjectName, subjectId} = subject;
    selectedSubjects = selectedSubjects.filter(e=>e.subjectId!==subjectId);
    alertMessage = `${subjectName}을 삭제하였습니다.`;

    // 현재 학점에서 삭제한 학점 빼고 dropdown 리스트에 다시 추가
    let subtractGrade = this._getGradeBySubjectId(subjectId);
    let addDropDownItem = {"label":subjectName, "value":subjectId, "grade":subtractGrade};
    let updatedDropdownMenu = dropdownMenu;
    updatedDropdownMenu.push(addDropDownItem);
    updatedDropdownMenu.sort((a,b)=>a.value < b.value ? -1 : a.value > b.value ? 1 : 0);

    this.setState({
    selectedSubjects,
    alertMessage,
    currentGrade:currentGrade-subtractGrade,
    dropdownMenu:updatedDropdownMenu},
    ()=>ToastStore.success(alertMessage+` (현재학점 : ${this.state.currentGrade})`));
  }

  // 예외 시간 클릭시 이벤트
  _onClickExceptionTime = (row, cols) => {
    let {exceptionTime} = this.state;
    exceptionTime[row][cols] = exceptionTime[row][cols] === -1 ? 0 : -1;
    this.setState({exceptionTime});
  }

  // 스케쥴링 시작 버튼 클릭시 이벤트
  _onClickSubmit = () => {
    let {currentGrade, alertMessage} = this.state;
    if(currentGrade<MIN_GRADE || currentGrade>MAX_GRADE){
      alertMessage = "스케줄링을 위해선 18학점~21학점 사이로 선택해주세요.";
      this.setState({alertMessage}, ()=>ToastStore.error(alertMessage));
      return;
    }

    alertMessage = "신청완료!";
    this.setState({alertMessage, isRedirectNextStep:true}, ()=>ToastStore.success(alertMessage));
  }

  // 과목 이름 가져오기
  _getGradeBySubjectId = (subjectId) => this.state.subjectDatas.find(e=>e.subjectId===subjectId).grade;

  _renderSubjectGuide = () => {
    let { subjectGuideDatas } = this.state;

    return (
      <div>
        <h4>Step 1. <small>수강 신청 가능한 과목을 확인하세요.</small></h4>
        <table className="table table-hover" style={{backgroundColor:"#fff"}}>
          <thead>
            <tr>
              <th>과목명</th>
              <th>취득 학점</th>
              <th>요일 및 시간</th>
            </tr>
          </thead>
          <tbody>
            {
              subjectGuideDatas.map((e,i)=> {
              return(
                <tr key={i}>
                  <td>{e.title} (#타입 {i%3+1})</td>
                  <td>{e.grade}학점</td>
                  <td>{e.dayAndTime}</td>
                </tr>
              )})
            }
          </tbody>
        </table>
      </div>
    )
  }

  _renderSubjectInputArea = () => {
    let {dropdownMenu, currentGrade} = this.state;
    return(
      <div className="inputArea">
      <h4>Step 2. <small>수강하고 싶은 과목을 18~21학점 사이로 선택해주세요.</small></h4>
        <Dropdown
          options={dropdownMenu}
          onChange={this._onSelectSubject}
          placeholder="시간표를 구성할 과목을 선택해주세요."
        />
        <ul>
          {this.state.selectedSubjects.map((e,i)=>{
            return(
                <li key={i} style={{marginTop:5, padding:5}} >
                  {e.subjectName}
                  <button className="btn btn-danger btn-sm" onClick={()=>this._onClickRemove(e)} style={{marginLeft:10}}>삭제</button>
                </li>
            )
          })}
        </ul>
        <div className="alert alert-info" role="alert">
          {`총 신청 학점 : ${currentGrade}`}
        </div>
      </div>
    )
  }

  _renderExceptionTimeSeletor = () => {
    const rows = [1,2,3,4,5,6,7,8];
    const cols = [1,2,3,4,5,6];
    const weeks = ["#", "월요일", "화요일", "수요일", "목요일", "금요일"];
    let {exceptionTime} = this.state;
    return(
      <div>
      <h4>Step 3. <small>비워두고 싶은 시간을 마킹하세요.</small></h4>
      <table className="table table-hover" style={{backgroundColor:"#fff"}}>
        <thead>
          <tr>
            {weeks.map((weekName, index)=><th key={index}>{weekName}</th>)}
          </tr>
        </thead>
        <tbody>
        {
          rows.map((e,i) => {
            return(
              <tr key={i}>
              {
                cols.map((e2,i2)=>{
                return(
                  i2===0 ?
                  <td key={i2}>{i+1}</td> :
                  <td
                    key={i2}
                    onClick={()=>this._onClickExceptionTime(i, i2-1)}
                    style={ exceptionTime[i][i2-1] === -1 ? {backgroundColor:"#E9573F"} : {} }
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

  render() {
    let {isRedirectNextStep} = this.state;
    if(isRedirectNextStep){
      return(
        <Redirect
          to={{
            pathname:"/timetable",
            state: this.state
          }}/>
      )
    }
    return (
      <div style={{padding:50}}>
        {this._renderSubjectGuide()}
        {this._renderSubjectInputArea()}
        {this._renderExceptionTimeSeletor()}
        <h4>Final Step. <small>아래 버튼을 누르시면 스케줄링을 시작합니다.</small></h4>
        <button className="btn btn-primary " onClick={this._onClickSubmit}>
          스케쥴링 시작
        </button>
      </div>

    );
  }
}
export default InputTemplate;
