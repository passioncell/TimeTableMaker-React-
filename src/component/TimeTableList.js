
import React, { Component } from 'react';
import { css } from 'react-emotion';

const EXCEPTION_TIME = -1; // 사용자가 원치않는 시간
const EMPTY_TIME = 0; // 공강 시간
const classTime = ["1교시", "2교시", "3교시", "4교시", "5교시", "6교시", "7교시", "8교시"];
const weekNames = ["#", "월요일", "화요일", "수요일", "목요일", "금요일"];

export default class TimeTableList extends Component{

  constructor(props){
    super(props);
  }

  render(){
    let {resultTimeTableList, subjectDatas} = this.props;

    return (
      resultTimeTableList.map((tableData, index) => {
        return(
          <div style={{marginTop:40}}>
            <h5>순번 : {index+1}</h5>
            <TimeTable tableData={tableData} subjectDatas={subjectDatas}/>
          </div>
        )
      })
    )
  }

}


class TimeTable extends Component{
  constructor(props){
    super(props);
  }

  _getSubjectNameById = (id) => {
    if(id===EMPTY_TIME) return "";
    if(id===EXCEPTION_TIME) return "X";
    let {subjectDatas} = this.props;
    return subjectDatas.find(({subjectId})=>id===subjectId).title;
  };

  _getSubjectColorById = (id) => {
    if(id===EMPTY_TIME) return "#ffffff";
    if(id==EXCEPTION_TIME) return "#ffffff"
    let {subjectDatas} = this.props
    return subjectDatas.find(({subjectId})=>id===subjectId).color;
  };

  render(){
    const {tableData} = this.props;

    return(
      <table class="table table-hover" style={{backgroundColor:"#fff"}}>
        <thead>
          <tr>
          {
            weekNames.map((e, i) => <th>{e}</th>)
          }
          </tr>
        </thead>
        <tbody>
          {
            tableData.map((e, i) => {
              return (
                <tr>
                <td>
                {
                  classTime[i]
                }
                </td>
                {
                  tableData[i].map((e2, i2) => {
                    return (
                      <td bgcolor = {this._getSubjectColorById(e2)}>
                        {this._getSubjectNameById(e2)}
                      </td>
                    )
                  })
                }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }
}
