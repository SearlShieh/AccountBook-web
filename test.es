/*console.log(1)
new Promise((resolve,reject)=>{
    console.log(2)
    setTimeout(()=>{
        console.log(3)
    },0)
    reject()
    for(let i=0;i<1000;i++){
        resolve()
    }
    
    console.log(4)
}).then(()=>{
    console.log(5)
}).catch(()=>{
    console.log(7)
})
setTimeout(()=>{
    console.log(6)
},0)*/
/*
let a=5
class A{
     a=10
    fn(){
        console.log(this.a)
    }
}
const b=new A().fn
b()*/
/*
function f(str){
    console.log(str)
    let str2="";
    let a=0,b=0,c=0;
    for(let i=0;i<str.length;i++){
        if(str.charAt(i)=='红')
            a++;
        else if(str.charAt(i)=='黄')
            b++;
        else
            c++;
    }
    while(a--){
        str2+='红';
    }
    while(b--){
        str2+='黄';
    }
    while(c--){
        str2+='蓝';
    }
    console.log(str2)
}
f('黄红红');*/

const { TRUE } = require("node-sass");

/*
var profession = ["one", "two","three","four"];
var a = {
  "one": [1, 2, 3, "12", 4, 22, 11],
  "two": [2, 3, "12"],
  "three": [2, 4, 3, "12", 11],
  "four":[2,11]
};
var jiaoji = a.one;
profession.reduce(getJiaoji);
console.log(jiaoji);

function getJiaoji(pre, cur, index, array) {
    var jiaoji = jiaoji.filter(function(n) {
      return a[cur].indexOf(n) != -1;
    }); 
    return jiaoji;
}*/
/*
let arr = [
    [1,2,3,4],[3,4,6],[4,5]
  ]
  arr.forEach(i=>{
    minArr = i;
    if(i.length<minArr.length){
      minArr = i;
    }
  })
  minArr.forEach(i=>{
    state = []
    arr.forEach(j=>{
      if(j.includes(i)){
        state.push(true)
      }
      else state.push(false)
        const stutas = state.every(i=>{
        return i===true
        })
  })
})*/
var a=new Array()
let arr = [
    [1, 2, 3, 4],
    [3, 4, 6],
    [4, 5,0],
  ];

arr.forEach(i=>{
    minArr = i;
    if(i.length<minArr.length){
      minArr = i;
    }
})

arr[0].forEach(i=>{
    z=0
    arr.forEach(j=>{
      if(j.includes(i)){
          z=1
      }
      else{
          z=0;
      }
    })
    if(z==1){
        a.push(i)
    }
    
})
console.log(minArr)