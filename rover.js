class Rover {
   // Write code here!
   constructor(position) {
      this.position = position;
      if (!position) {
        throw Error("position required.");
      }
      this.mode = "NORMAL";
      this.generatorWatts = 110;
   }
   receiveMessage(message){
      let messageResponse = {message:message.name,results:[]};
      message.commands.forEach(command => {
         if(command.commandType == "MOVE"){
            if(this.mode == "NORMAL"){
               this.position = command.value;
               messageResponse.results.push({completed: true});
            }
            else{
               messageResponse.results.push({completed: false});
            }
         }
         else if(command.commandType == "STATUS_CHECK"){
            messageResponse.results.push({
               completed: true, 
               roverStatus: {
                  mode: this.mode, 
                  generatorWatts: this.generatorWatts, 
                  position: this.position
               }
            });
         }
         else if(command.commandType == "MODE_CHANGE"){
            this.mode = command.value;
            messageResponse.results.push({completed: true});
         }
      });
      return messageResponse;
   }
}

module.exports = Rover;