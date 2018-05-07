# sentience

```javascript
 // create an environment
 let env = new Environment()

 // create an object you mean to endow with 'sentience'
 let chaser = { y: 10, attributes: ['y'] }

 // give this object some actions (methods)
 chaser.up =  () => chaser.y -= 5,
 chaser.down = () => chaser.y += 5,

 // create another object in the environment, and give it some actions too
 let ball = { y: 10, attributes: ['y'] }
 ball.move = () => ball.y += randomChoiceFrom([-5, 5])

 // endow the chaser with sentience. it can observe itself and the ball
 // it can also move up and down in response to these signals
 env.createSentience(chaser, [ball, chaser], ['up', 'down'])

 // reward the chaser when its y is the same as the ball's y
 // i.e. reward it when it catches the ball
 env.rewardSentience([chaser], 2, () => chaser.y == ball.y)

 for (var i = 0; i < 1000000; i++) {  env.run(() => ball.move()) }

// helper function
 function randomChoiceFrom(array) {
   let randomIndex = Math.floor(Math.random() * array.length)
   return array[randomIndex]
 }
```
