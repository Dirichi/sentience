// let env = new Environment()
//
// chaser = {
//   y: 10,
//   attributes: ['y']
// }
// chaser.up =  () => chaser.y -= 5,
// chaser.down = () => chaser.y += 5,
//
// ball = {
//   y: 10,
//   attributes: ['y']
// }
// ball.move = () => ball.y += 0
//
// env.createSentience(chaser, [ball, chaser], ['up', 'down'])
// env.rewardSentience([chaser], 2, () => chaser.y == ball.y)
//
// for (var i = 0; i < 1000000; i++) {
//   env.run(() => ball.move())
// }
