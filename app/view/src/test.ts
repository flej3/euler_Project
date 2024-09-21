let a: number = 0;
for(let i = 0; i < 10; i++) {
    a += i;
    console.log(a);
}
document.addEventListener('DOMContentLoaded',() => {
    const test = document.getElementById('testId');
    if(test){
        test.innerHTML = '좀 살려줘라';
    }
});
