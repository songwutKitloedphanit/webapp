function draw(round) {
  return new Promise((resolve) => {
    console.log('Wait 2 second...');
    setTimeout(() => {
      const num = Math.floor(Math.random() * 10); 
      console.log(`Num ${round} : ${num}`);
      resolve(num);
    }, 2000);
  });
}

async function play() {
    for (let round =1; round <=3; round++){
        const num = await draw(round);
        if(num % 2 !== 0){
            console.log('You lost');
            return;
        }
    }
    console.log('You win');
}
play();