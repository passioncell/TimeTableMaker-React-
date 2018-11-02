// let combinationResult = [];
const DAY = {MONDAY:0, TUESDAY:1, WEDNESDAY:2, THURSDAY:3, FRIDAY:4};
const TIME = {FIRST:0, SECOND:1, THIRD:2, FORTH:3, FIFTH:4, SIXTH:5, SEVENTH:6, EIGHT:7};

const dummyData =   [
{
  subjectId:1,
  title : "과목A",
  grade: 3,
  lesson: [ // lesson안에는 총 3 타입의 수강 요일과 타임이 있습니다.
    [
      {day:DAY.MONDAY, time:[TIME.FIRST, TIME.SECOND]},
      {day:DAY.THURSDAY, time:[TIME.FIRST, TIME.SECOND]}
    ], // 월목 1교시가 한세트
    [
      {day:DAY.TUESDAY, time: [TIME.FIRST, TIME.SECOND]},
      {day:DAY.WEDNESDAY, time: [TIME.FIRST, TIME.SECOND]}
    ], // 수목 1교시가 한세트
    [
     {day:DAY.MONDAY, time:[TIME.THIRD, TIME.FORTH]},
     {day:DAY.FRIDAY, time:[TIME.THIRD, TIME.FORTH]}
    ]
  ]
},
{
  subjectId:2,
  title : "과목B",
  grade: 3,
  lesson: [
    [
      {day:DAY.WEDNESDAY, time:[TIME.THIRD, TIME.FORTH]},
      {day:DAY.FRIDAY, time:[TIME.THIRD, TIME.FORTH]}
    ],
    [
      {day:DAY.MONDAY, time: [TIME.FIFTH, TIME.SIXTH]},
      {day:DAY.TUESDAY, time: [TIME.FIRST, TIME.SECOND]}
    ],
    [
     {day:DAY.MONDAY, time:[TIME.FIFTH, TIME.SIXTH]},
     {day:DAY.FRIDAY, time:[TIME.THIRD, TIME.FORTH]}
    ]
  ]
},
// {
//   subjectId:3,
//   title : "과목C",
//   grade: 1,
//   lesson: [
//     [
//       {day:DAY.MONDAY, time:[TIME.FIFTH, TIME.SIXTH]}
//     ],
//     [
//       {day:DAY.TUESDAY, time: [TIME.SEVENTH, TIME.EIGHT]}
//     ],
//     [
//      {day:DAY.WEDNESDAY, time:[TIME.FIFTH, TIME.SIXTH]}
//     ]
//   ]
// },
// {
//   subjectId:4,
//   title : "과목D",
//   grade: 2,
//   lesson: [
//     [
//       {day:DAY.WEDNESDAY, time:[TIME.FIRST, TIME.SECOND]}
//     ],
//     [
//       {day:DAY.THURSDAY, time: [TIME.SEVENTH, TIME.EIGHT]}
//     ],
//     [
//      {day:DAY.FRIDAY, time:[TIME.FIRST, TIME.SECOND]}
//     ]
//   ]
// },
// {
//   subjectId:5,
//   title : "과목E",
//   grade: 2,
//   lesson: [
//     [
//       {day:DAY.WEDNESDAY, time:[TIME.THIRD, TIME.FORTH]}
//     ],
//     [
//       {day:DAY.THURSDAY, time: [TIME.SEVENTH, TIME.EIGHT]}
//     ],
//     [
//      {day:DAY.FRIDAY, time:[TIME.THIRD, TIME.FORTH]}
//     ]
//   ]
// },
// {
//   subjectId:6,
//   title : "과목F",
//   grade: 2,
//   lesson: [
//     [
//       {day:DAY.WEDNESDAY, time:[TIME.THIRD, TIME.FORTH]}
//     ],
//     [
//       {day:DAY.THURSDAY, time: [TIME.SEVENTH, TIME.EIGHT]}
//     ],
//     [
//      {day:DAY.FRIDAY, time:[TIME.THIRD, TIME.FORTH]}
//     ]
//   ]
// },
// {
//   subjectId:7,
//   title : "과목G",
//   grade: 2,
//   lesson: [
//     [
//       {day:DAY.WEDNESDAY, time:[TIME.THIRD, TIME.FORTH]}
//     ],
//     [
//       {day:DAY.THURSDAY, time: [TIME.SEVENTH, TIME.EIGHT]}
//     ],
//     [
//      {day:DAY.FRIDAY, time:[TIME.THIRD, TIME.FORTH]}
//     ]
//   ]
// },
// {
//   subjectId:8,
//   title : "과목H",
//   grade: 2,
//   lesson: [
//     [
//       {day:DAY.WEDNESDAY, time:[TIME.THIRD, TIME.FORTH]}
//     ],
//     [
//       {day:DAY.THURSDAY, time: [TIME.SEVENTH, TIME.EIGHT]}
//     ],
//     [
//      {day:DAY.FRIDAY, time:[TIME.THIRD, TIME.FORTH]}
//     ]
//   ]
// }
];


let initArray = function(){
  array = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ];
  return array;
}

// userTimeTable[TIME][DAY];
let userTimeTable = initArray();

let timeTableList = [];


let getSubjectCombination = function(subjects, selectedSubjects, currentGrade, maxGrade, index){
  if(index<0 || subjects.length<=0 || maxGrade <=0){
    console.log("input invalid.");
    return;
  }

  if(currentGrade == maxGrade){
    console.log("1.과목 조합");
    console.log(selectedSubjects);
    let filteredSubjects = dummyData.filter(e=>selectedSubjects.find(e2=>e2==e.subjectId));
    console.log(filteredSubjects);
    makeTimeCombination(filteredSubjects, [], 0);
    // 찾아낸 조합을 이용하여 가능한 시간표를 구성한다.

    return;
  }
  else if(currentGrade > maxGrade || index>subjects.length-1)
    return;

  for(let i=index; i<subjects.length; i++){
    let currentSubject = subjects[i].subjectId;

    // 현재 노드가 이전에 추가된 노드인지 중복 검사
    let isDuplicate = selectedSubjects.find(e=>e==currentSubject) == undefined;

    if(isDuplicate){
      selectedSubjects.push(currentSubject);
      // 중복이 아닌 경우는 selected 배열에 노드를 추가하고 index++, currentGrade 증가하여 재귀 호출
      currentGrade += subjects[i].grade;
      getSubjectCombination(subjects, selectedSubjects, currentGrade, maxGrade, ++index);
      selectedSubjects.splice(selectedSubjects.length-1, 1);
      currentGrade -= subjects[i].grade;
    }
    else{
      // 중복인 경우는 index만 증가하여 재귀 호출
      getSubjectCombination(subjects, selectedSubjects, currentGrade, maxGrade, ++index);
    }
  }
}

let makeTimeCombination = function(filteredSubjects, combination ,target){
    let currentTarget = filteredSubjects[target];

    if(combination.length == filteredSubjects.length){
      // 조합을 확정하기 전 과목마다 시간표가 겹치는지를 확인한다.
      // 충돌이 안났으면 최종적인 시간표로 결정.
      let isCrash = checkCrash(combination);
      if(!isCrash){
        console.log("2. 시간표 조합");
        console.log(combination);
        fillTimeTable(combination);
        return;
      }
    }

    if(target >= filteredSubjects.length || currentTarget == undefined){
      return;
    }

    for(let i=0; i<currentTarget.lesson.length; i++){
      let attachData = Object.assign(currentTarget.lesson[i], {subjectId:currentTarget.subjectId});
      combination.push(attachData);
      makeTimeCombination(filteredSubjects, combination, target+1);
      combination.splice(combination.length-1, 1);
    }

  }

  let checkCrash = function(combination){
    let checkBuffer = initArray();

    for(let i=0; i<combination.length; i++){
      let subjectId = combination[i].subjectId;
      for(let j=0; j<combination[i].length; j++){
        let {day, time} = combination[i][j];
        for(let k=0; k<time.length ; k++){
          if(checkBuffer[time[k]][day] == 0){
            checkBuffer[time[k]][day] = subjectId;
          }else{
            return true;
          }
        }
      }
    }
    return false;
  }

let fillTimeTable = function(combination){
  //조합된 시간표 2차원 배열에 적용 후 출력
  for(let i=0; i<combination.length; i++){
    let subjectId = combination[i].subjectId;
    for(let j=0; j<combination[i].length; j++){
      let {day, time} = combination[i][j];
      for(let k=0; k<time.length; k++){
        if(userTimeTable[time[k]][day] == 0){
          userTimeTable[time[k]][day] = subjectId;
        }
        else{
          console.log("타임이 겹치는게 있음.");
        }
      }
    }
  }

  printArray(userTimeTable);
  userTimeTable = initArray();
}


let printArray = function(array){
  for(let i=0; i<array.length; i++){
    for(let j=0; j<array[0].length; j++){
      process.stdout.write(array[i][j] +" ");
    }
    console.log("");
  }
  console.log("\n\n");
}



// (수강희망 과목 데이터, 체크배열, 임시 학점 합계, 조합 할 최종 학점 합계, 시작 인덱스)
getSubjectCombination(dummyData, [], 0, 6, 0);

printArray(timeTableList);
