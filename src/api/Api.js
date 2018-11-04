/*
  SERVER HOST INFOMATION..
*/
const PORT = 3005;
const HOST = "http://114.70.234.108:"+PORT+"/";

/*
[GET]
*/
export const getSubjects = () => HOST+"api/subjects";
export const getSubjectsGuide = () => HOST+"api/subjects-guide";
export const getSubject = (id) => HOST+"api/subject/"+id

/*
  [POST]
*/

/*
  [PUT]
*/

/*
  [UPDATE]
*/
