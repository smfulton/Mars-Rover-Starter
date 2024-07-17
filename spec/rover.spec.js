const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  // 7 tests here!
  it("constructor sets position and default values for mode and generatorWatts",function(){
    let rover = new Rover(98382);
    expect(typeof rover.position).toBe("number");
    expect(rover.mode).toBe("NORMAL");
    expect(rover.generatorWatts).toBe(110);
  });
  it("response returned by receiveMessage contains the name of the message",function(){
    let rover = new Rover(98382);
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let receivedMessage = rover.receiveMessage(message);
    expect(receivedMessage.message).toBe(message.name);
  });
  it("response returned by receiveMessage includes two results if two commands are sent in the message",function(){
    let rover = new Rover(98382);
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let receivedMessage = rover.receiveMessage(message);
    expect(receivedMessage.results.length).toBe(commands.length);
  });
  it("responds correctly to the status check command",function(){
    let rover = new Rover(98382);
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let message = new Message('Test message with two commands', commands);
    let receivedMessage = rover.receiveMessage(message);
    receivedMessage.results.forEach(result => {
      if(result.hasOwnProperty("roverStatus")){
        expect(result.roverStatus.position).toBe(rover.position);
        expect(result.roverStatus.mode).toBe(rover.mode);
        expect(result.roverStatus.generatorWatts).toBe(rover.generatorWatts);
      }
    });
  });
  it("responds correctly to the mode change command",function(){
    let rover = new Rover(98382);
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message = new Message('Test message with a mode change command', commands);
    let receivedMessage = rover.receiveMessage(message);
    expect(receivedMessage.results[0].completed).toBe(true);
    expect(rover.mode).toBe("LOW_POWER");
  });
  it("responds with a false completed value when attempting to move in LOW_POWER mode",function(){
    let rover = new Rover(98382);
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER'),new Command("MOVE",20000)];
    let message = new Message('Test message with two commands', commands);
    let receivedMessage = rover.receiveMessage(message);
    expect(receivedMessage.results[0].completed).toBe(true);
    expect(receivedMessage.results[1].completed).toBe(false);
    expect(rover.position).toBe(98382);
  });
  it("responds with the position for the move command",function(){
    let rover = new Rover(98382);
    let commands = [new Command("MOVE",20000)];
    let message = new Message('Test message with two commands', commands);
    let receivedMessage = rover.receiveMessage(message);
    expect(rover.position).toBe(20000);
  });

});
