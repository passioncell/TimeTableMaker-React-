import React, { Component } from 'react';
import { css } from 'react-emotion';
import { ClipLoader } from 'react-spinners';
import TimeTableList from '../component/TimeTableList';
import { Redirect } from 'react-router-dom';

let bufferTable;

export default class MainTemplate extends Component{

  constructor(props){
    super(props);
    bufferTable = this._initArray();
    this.state={
      subjectDatas: [],
      isFinishScheduling:false,
      resultTimeTableList: [],
      renderEmptyPage: false,
      redirectToPrev: false
    }
  }

  componentDidMount(){
    setTimeout(()=>this._makeScheduling(), 200);
  }

  _makeScheduling = () => {
    // 리다이렉트 전 컴포넌트에서 받은 데이터를 토대로 스케줄링할 과목들을 선정한다.
    // 사용자가 선택한 과목만 필터링
    let notFilterdSubjects = this.props.location.state.subjectDatas;
    let selectedSubjects =  this.props.location.state.selectedSubjects;
    let filterdSubjects = notFilterdSubjects.filter((e,i) =>
      selectedSubjects.find(({subjectId}) => e.subjectId===subjectId)
    );
    // 사용자의 선택학점
    let targetGrade = 0;
    filterdSubjects.forEach(({grade})=> targetGrade+=grade);
    // 스케쥴링 알고리즘 호출
    // 작업 완료시 결과 데이터가 없으면 빈페이지 노출.
    this.setState({subjectDatas:filterdSubjects}, ()=>{
      this._makeTimeCombination(filterdSubjects, [], 0)
      this.setState({isFinishScheduling:true}, ()=>{
        let isEmpty = this.state.resultTimeTableList.length<=0;
        this.setState({renderEmptyPage:isEmpty})
      })
    });
  }

  // 사용자가 원치 않는 시간으로 설정한 2차원 배열을 리턴한다.
  _initArray = () => {
    let targetArray = this.props.location.state.exceptionTime;
    let _initArray = JSON.parse(JSON.stringify(targetArray));
    return _initArray;
  };

  // Call by reference에 의해 의도치 않은 편집이 될 수 있어 배열을 복제하는 모듈
  _copyArray = (array) => {
    let copiedArray = this._initArray();
    for(let i=0; i<array.length; i++){
      for(let j=0; j<array[0].length; j++){
        copiedArray[i][j] = array[i][j];
      }
    }
    return copiedArray;
  }


  // 가능한 시간표의 조합을 찾아낸다.
  _makeTimeCombination = (filteredSubjects, combination, target) => {
    let currentTarget = filteredSubjects[target];
    if (combination.length === filteredSubjects.length) {
      // 조합을 확정하기 전 과목마다 시간표가 겹치는지를 확인한다.
      // 충돌이 안났으면 최종적인 시간표로 결정.
      let isCrash = this._checkCrash(combination);
      if (!isCrash) {
        this._saveValidTimeTable(combination);
        return;
      }
    }

    if (target >= filteredSubjects.length || currentTarget === undefined) {
      return;
    }

    for (let i = 0; i < currentTarget.lesson.length; i++) {
      let attachData = Object.assign(currentTarget.lesson[i], {
        subjectId: currentTarget.subjectId
      });
      combination.push(attachData);
      this._makeTimeCombination(filteredSubjects, combination, target + 1);
      combination.splice(combination.length - 1, 1);
    }

  }

  // 시간표의 조합을 찾는 과정에서 시간 충돌이 일어나는지를 체크하는 모듈
  _checkCrash = (combination) => {
    let checkBuffer = this._initArray();
    for (let i = 0; i < combination.length; i++) {
      let subjectId = combination[i].subjectId;
      for (let j = 0; j < combination[i].length; j++) {
        let { day, time } = combination[i][j];
        for (let k = 0; k < time.length; k++) {
          if (checkBuffer[time[k]][day] === 0) {
            checkBuffer[time[k]][day] = subjectId;
          } else {
            return true;
          }
        }
      }
    }
    return false;
  }

  // 단말노드의 최종 유효 시간표를 결과 리스트에 추가한다.
  _saveValidTimeTable = (combination) => {
    let resultArray = this._copyArray(bufferTable);
    for (let i = 0; i < combination.length; i++) {
      let subjectId = combination[i].subjectId;
      for (let j = 0; j < combination[i].length; j++) {
        let { day, time } = combination[i][j];
        for (let k = 0; k < time.length; k++) {
          if(resultArray[time[k]][day] === 0){
              resultArray[time[k]][day] = subjectId;
          }
        }
      }
    }
    let resultTimeTableList = this.state.resultTimeTableList;
    resultTimeTableList.push(resultArray);
    this.setState({ resultTimeTableList }, () => {
      bufferTable = this._initArray();
    });
  }

  // 사용자 경험을 위해 알고리즘의 계산 작업동안 로딩 화면을 보여준다.
  _renderLoading = () => {
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    `;
    //
    return(
      <div style={{textAlign:"center", width:"100%", backgroundColor:"#ffffff", marginTop:100}}>
        <ClipLoader
          className={override}
          sizeUnit={"px"}
          size={150}
          color={'#123abc'}
          loading={!this.state.isFinishScheduling}
        />
      </div>
    );
  }

  // 사용자의 입력조건에 따른 결과 데이터가 없을시에 보여줄 빈 페이지
  _renderEmpty = () => {
    return(
      <div style={{padding:20,marginTop:40, textAlign:"center"}}>
        <img src="/not_found.png" alt={"search not forund images"}/>
        <h5>조건에 일치하는 시간표가 존재하지 않습니다.</h5>
        <button className="btn btn-primary" onClick={()=>this.setState({redirectToPrev:true})}>
          과목 및 예외 시간 재설정
        </button>
      </div>
    )
  }

  _renderGuideHeader = () => {
      return(
        <div >
          <h4>※수강 신청 과목을 토대로 원치않는 시간을 제외한 시간표를 스케줄링 하였습니다.</h4>
          <p>총 <b>{this.state.resultTimeTableList.length}</b>가지 시간표를 찾았습니다.</p>
          <button className="btn btn-primary" onClick={()=>this.setState({redirectToPrev:true})}>
            과목 및 예외 시간 재설정
          </button>
        </div>
      )
  }

  _renderContent = () => {
    let {resultTimeTableList, subjectDatas} = this.state;
    return (
      <div style={{padding:50}}>
      {this._renderGuideHeader()}
      <TimeTableList
        resultTimeTableList={resultTimeTableList}
        subjectDatas={subjectDatas}/>
      </div>
    )
  }

  _renderRedirectPrev = () => {
    let {dropdownMenu, subjectDatas, currentGrade,subjectGuideDatas,
      subjectDats, selectedSubjects, exceptionTime} = this.props.location.state;
    let prevState = {
      dropdownMenu,
      alertMessage:"",
      currentGrade,
      subjectGuideDatas,
      subjectDatas,
      selectedSubjects,
      isRedirectNextStep:false,
      exceptionTime
  }
    return (
      <Redirect to={{
        pathname:"/",
        state: prevState
      }}/>
    )
  }

  render(){
    let {isFinishScheduling, renderEmptyPage, redirectToPrev} = this.state;
    if(isFinishScheduling){
      if(renderEmptyPage){
        return redirectToPrev ? this._renderRedirectPrev() : this._renderEmpty()
      }
      else{
        return redirectToPrev ? this._renderRedirectPrev() : this._renderContent()
      }
    }
    else{
      return this._renderLoading()
    }
  }
}
