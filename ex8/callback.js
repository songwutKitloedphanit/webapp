function draw(round, callback){
    console.log('Wait 2 second...');
    setTimeout(()=> {
        const num =Math.floor(Math.random() * 10);
        console.log(`Num ${round} : ${num}`);
        callback(num);
    }, 2000);
}

function play(round){
    if(round > 3){
        console.log('You win');
        return;
    }
    
    draw(round, (num) => {
        if (num % 2 == 0){
            play(round+1);
        }else{
            console.log('You lost');
        }
    });
}
play(1);