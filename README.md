# sentience

```javascript
 // create an environment
 let env = new Environment()

 // create an object you mean to endow with 'sentience'
 let chaser = { y: 0, attributes: ['y'] }

 // give this object some actions (methods)
 chaser.up =  () => chaser.y -= 0.1,
 chaser.down = () => chaser.y += 0.1,

 // create another object in the environment, and give it some actions too
 let ball = { y: 0, attributes: ['y'] }
 ball.move = () => ball.y += randomChoiceFrom([-0,1, 0.1])

 // endow the chaser with sentience. it can observe itself and the ball
 // it can also move up and down in response to these signals
 env.createSentience([chaser], [ball, chaser], ['up', 'down'])

 // reward the chaser when its y is the same as the ball's y
 // i.e. reward it when it catches the ball
 env.rewardSentience([chaser], () => Math.abs(chaser.y - ball.y) < 0.2, 2)

// run the environment. if all goes well you should see that the console.log
// print outs hover around 0.2 or less
 for (var i = 0; i < 1000000; i++) {
   env.run(function () {
     if (i % 500 == 0) { console.log(Math.abs(chaser.y - ball.y)); ball.move() }
   })
 }

// helper function
 function randomChoiceFrom(array) {
   let randomIndex = Math.floor(Math.random() * array.length)
   return array[randomIndex]
 }
```
