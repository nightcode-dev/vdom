var fs = require('fs')
class Line{
   constructor(path){
      this.path=path
      this.lines = [];
      var data = fs.readFileSync(this.path,'utf8')
      var file = data.split(/\r?\n/)
      for(var i=0;i < file.length;i++){
         var obj = {
            into:file[i],
            lineNumber:i+1
         }
         this.lines.push(obj)
      }
   }
   text(){
      var data = fs.readFileSync(this.path,'utf8')
      return data;
   }
   looper(func){
      for(var i=0;i < this.lines.length;i++){
         var line = this.lines[i]
         func(line)
      }
   }
   
}
module.exports = Line