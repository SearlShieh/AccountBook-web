const ret = []

let a = 3;

(function(a){
    let i = 0;
    for(;i<3;i++) {
        const p = () => new Promise((resolve) => {
            resolve(i * a)
        })
        ret.push(p)
    }
})(1)

ret[0]().then(console.log) 
ret[1]().then(console.log) 
ret[2]().then(console.log) 
