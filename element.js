var Line = require('./line.js')


class Element {
   
   constructor(obj){
      this.dom = obj[0];
      this._dom = obj[0];
   }
   
   count(data){
      var lines = []
      var file = data.split(/\r?\n/)
      for(var i=0;i < file.length;i++){
         var obj = {
            into:file[i],
            lineNumber:i+1
         }
         lines.push(obj)
      }
      var lastIndex = lines.length
      var lastobj = lines[lastIndex-1]
      var lastline = lastobj.lineNumber
      return lastline
   }
   
   near(arr,goal,FindOn){
      var counts = [];
      for(var i = 0;i <= arr.length;i++){
         if(i != arr.length){
            if(FindOn === 'after'){
               if(arr[i] > goal){
                  counts.push(arr[i])
               }
            }else if(FindOn === 'before'){
               if(arr[i] < goal){
                  counts.push(arr[i])
               }
            }
         }
      }
      var closest = counts.reduce(function(prev, curr) {
         return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
      });
      
      return closest;
   }
   
   allIndexOf(str, toSearch) {
   
    var indices = [];
    for(var pos = str.indexOf(toSearch); pos !== -1; pos = str.indexOf(toSearch, pos + 1)) {
        indices.push(pos);
    }
    return indices;
    }
    
   get html(){
      var vdom = this.dom
      var html = [];
         if(vdom.type == 'open'){
            var attrs = Object.assign({},vdom)
            delete attrs.name
            delete attrs.tag
            delete attrs.type
            delete attrs.line
            delete attrs.into
            var isfull = Object.keys(attrs).length !== 0
            
            if(isfull){
               
               var hattrs = ''
               for(const [key,value] of Object.entries(attrs)){
                  var attr = `${key}='${value}' `
                  hattrs += attr
               }
               var into = vdom.into
               var isifull = into != undefined
               if(isifull){
               var omark = this.allIndexOf(into,'<')
               if(omark.length == 0){
                  var tag = `<${vdom.name} ${hattrs}>${into}</${vdom.name}>`
                  var isfull = html[0] != undefined
                  if(isfull){
                     html[0] += tag
                  }else{
                     html[0] = tag
                  }
               }else{
                  var tag = `<${vdom.name} ${hattrs}></${vdom.name}>`
                  var isfull = html[0] != undefined
                  if(isfull){
                     html[0] += tag
                  }else{
                     html[0] = tag
                  }
               }
            }else{
               var tag = `<${vdom.name} ${hattrs}></${vdom.name}>`
                  var isfull = html[0] != undefined
                  if(isfull){
                     html[0] += tag
                  }else{
                     html[0] = tag
                  }
            }
            }else{
               var into = vdom.into
               var isifull = into != undefined
               if(isifull){
               var omark = this.allIndexOf(into,'<')
               if(omark.length == 0){
                  var tag = `<${vdom.name} >${into}</${vdom.name}>`
                  var isfull = html[0] != undefined
                  if(isfull){
                     html[0] += tag
                  }else{
                     html[0] = tag
                  }
               }else{
                  var tag = `<${vdom.name} ></${vdom.name}>`
                  var isfull = html[0] != undefined
                  if(isfull){
                     html[0] += tag
                  }else{
                     html[0] = tag
                  }
               }
            }else{
               var tag = `<${vdom.name} ></${vdom.name}>`
                  var isfull = html[0] != undefined
                  if(isfull){
                     html[0] += tag
                  }else{
                     html[0] = tag
                  }
            }
            }
            
           
          }
          
         
         
         var htm = ''
         for(var i = 0;i < html.length;i++){
            if(i == 0){
               htm = `${html[i]} \n `;
            }else{
               if(html[i] !== undefined){
                  htm += `${html[i]} \n `
               }
            }
         }
         return htm;
   }
   set html(val){
      throw new Error('can not change html dom')
   }
   
   set inner(val){
      var tin = [val.indexOf('<'),val.indexOf('>')]
      if(tin[0] == -1 && tin[1] == -1){
         this.dom.into = val
      }else{
         throw new Error('you can not inject html code in text of tag')
      }
   }
   
   setAttribute(key,val){
      this.dom[key] = val;
   }
}

module.exports = Element