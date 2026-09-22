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

function play(round) {
  if (round > 3) {
    console.log('You win');
    return Promise.resolve();
  }

  return draw(round).then((num) => {
    if (num % 2 === 0) {
      return play(round + 1);
    } else {
      console.log('You lost');
    }
  });
}

play(1);