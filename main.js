var fs = require('fs')
var Line = require('./line.js')
var elc = require("./element.js")
class Html {
   constructor(path){
      this.dom = [];
      this.path = path;
      this._html = '';
      this.rs;
      
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
   
   render(){
      var vdom = [];
      var reader = new Line(this.path)
      var lines = reader.lines
      reader.looper((line)=>{
         
         var otagindex = this.allIndexOf(line.into,'<')
         var ctagindex = this.allIndexOf(line.into,'>')
         
         if(ctagindex.length === 1 && otagindex.length === 1){
         
         var tmp = line.into.slice(line.into.indexOf('<')+1,line.into.indexOf('>'))
         
         if(tmp.indexOf('/') != -1){
            var elm = {
            type:'close',
            name:tmp.slice(1),
            tag:{
               openTagIndex:line.into.indexOf('<'),
               closeTagIndex:line.into.indexOf('>'),
               tag:line.into.slice(line.into.indexOf('<'),line.into.indexOf('>')+1)
            },
            line:line.lineNumber
            }
            var selarr = lines.slice(0,lines.indexOf(line))
            for(var i = 0;i < selarr.length;i++){
               var found = this.allIndexOf(selarr[i].into,`<${elm.name}`)
               if(found.length != 0){
                  if(found.length == 1){
                     var focused =selarr[i].into.slice(found)
                     var ioct = this.allIndexOf(focused,'>')
                     var openTag = focused.slice(0,ioct[0]+1)
                     elm.openTag={
                         line:selarr[i].lineNumber,
                         openIndex:found[0],
                         closeIndex:+found+ioct[0],
                         tag:openTag
                     }
                  }else{
                     continue;
                  }
               }
            }
            vdom.push(elm)
         }else{
            var i = tmp.indexOf(' ')
            var li = tmp.lastIndexOf(' ')
            var elm = {
            type:'open',
            name:tmp.slice(0,i),
            tag:{
               openTagIndex:line.into.indexOf('<'),
               closeTagIndex:line.into.indexOf('>'),
               tag:line.into.slice(line.into.indexOf('<'),line.into.indexOf('>')+1)
            },
            line:line.lineNumber
            }
            if(tmp.indexOf('=') != -1){
               if(i == li){
                  var li = tmp.length;
               }
               var selected = tmp.slice(i+1,li)
               var spcindex = this.allIndexOf(selected,'=')
               var attr = selected.slice(0,spcindex);
               var equlindex = this.allIndexOf(selected,'=')
               var spclindex = this.allIndexOf(selected,' ')
               for(var ei = 0;ei <= equlindex.length;ei++){
                  if(ei != equlindex.length){
                     var attr = selected.slice(this.near(spclindex,equlindex[ei],'before'),equlindex[ei]);
                      var attr = attr.trim()
                       var qotindex = this.allIndexOf(selected,"'")
                       var secqotOne = this.near(qotindex,equlindex[ei],'after')
                        var secqotTwo = this.near(qotindex,secqotOne,'after')
                        var val = selected.slice(secqotOne+1,secqotTwo)
                        elm[attr]=val
                  }
               }
            }
            vdom.push(elm)
            
         }
         }else if(ctagindex.length >= 2 && otagindex.length >= 2){
            for(var i = 0;i <= ctagindex.length && i <= otagindex.length;i++){
                if(i != ctagindex.length && i != otagindex.length){
                   var tag = line.into.slice(otagindex[i],ctagindex[i]+1)
                   var tmp = tag.slice(tag.indexOf('<')+1,tag.indexOf('>'))
                   if(tmp.indexOf('/') != -1){
                      var elm = {
                         type:'close',
                         name:tmp.slice(1),
                         tag:{
                            openTagIndex:otagindex[i],
                            closeTagIndex:ctagindex[i],
                            tag:tag
                         },
                         line:line.lineNumber
                      }
                      var close = true;
                      var croped = line.into.slice(0,otagindex[i])
                      var found = this.allIndexOf(croped,`<${elm.name}`)
                      if(found.length > 1){
                         var cti = this.allIndexOf(line.into,`</${elm.name}`)
                         cti = cti.reverse();
                         var chioce = cti.find((one,index)=>{
                            return one == otagindex[i]
                         })
                         var select = cti.indexOf(chioce)
                         var disp = cti.length-select
                         var sliced = line.into.slice(found[found.length-disp])
                         var ioct = this.allIndexOf(sliced,'>')
                         var openTag = line.into.slice(found[found.length-disp],(found[found.length-disp]+ioct[0])+1)
                         elm.openTag={
                         openIndex:found[found.length-disp],
                         closeIndex:found[found.length-disp]+ioct[0],
                         tag:openTag
                         }
                         
                      }else{
                         var focused =croped.slice(found)
                         var ioct = this.allIndexOf(focused,'>')
                         var openTag = focused.slice(0,ioct[0]+1)
                         elm.openTag={
                         openIndex:found[0],
                         closeIndex:ioct[0],
                         tag:openTag
                         }
                         
                      }
                   }else{
                     var is = tmp.indexOf(' ')
                     var lis = tmp.lastIndexOf(' ')
                     var close = false;
                     var elm = {
                        type:'open',
                        name:tmp.slice(0,is),
                        tag:{
                            openTagIndex:otagindex[i],
                            closeTagIndex:ctagindex[i],
                            tag:tag
                         },
                        line:line.lineNumber
                     }
                     if(tmp.indexOf('=') != -1){
                        if(is == lis){
                           var lis = tmp.length;
                        }
                        var selected = tmp.slice(is,lis)
                        var equlindex = this.allIndexOf(selected,'=')
                        var spclindex = this.allIndexOf(selected,' ')
                        
                            
                  
                  
                       
                          
                          
                        
                        for(var ei = 0;ei <= equlindex.length;ei++){
                           if(ei != equlindex.length){
                              var attr = selected.slice(this.near(spclindex,equlindex[ei],'before'),equlindex[ei]);
                              var attr = attr.trim()
                              var qotindex = this.allIndexOf(selected,"'")
                              var secqotOne = this.near(qotindex,equlindex[ei],'after')
                              var secqotTwo = this.near(qotindex,secqotOne,'after')
                              var val = selected.slice(secqotOne+1,secqotTwo)
                              elm[attr]=val
                              
                                 
                        }
                        
                     }
                     
                   }
               
               
               if(i != 0){
                  var ctagsec = ctagindex[i]
                  var otagsec = otagindex[(otagindex.length-1)-i]
                  var into = line.into.slice(ctagsec+1,otagsec)
                  elm.into = into
               }else{
                  var ctagsec = ctagindex[i]
                  var otagsec = otagindex[otagindex.length-1]
                  var into = line.into.slice(ctagsec+1,otagsec)
                  elm.into = into
               }
              
            }
               vdom.push(elm)
               }
               
         }
         }
         
      })
      this.dom = vdom
   }
   
   
   get html(){
      
      var vdom = this.dom
      var html = [];
      for(var i =0;i < vdom.length;i++){
         
         if(vdom[i].type == 'close'){
            var tag = `</${vdom[i].name}>`
            var isfull = html[vdom[i].line-1] != undefined
            if(isfull){
               html[vdom[i].line-1] += tag
            }else{
               html[vdom[i].line-1] = tag
            }
         }else{
            var attrs = Object.assign({},vdom[i])
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
               var into = vdom[i].into
               var isifull = into != undefined
               if(isifull){
               var omark = this.allIndexOf(into,'<')
               if(omark.length == 0){
                  var tag = `<${vdom[i].name} ${hattrs}>${into}`
                  var isfull = html[vdom[i].line-1] != undefined
                  if(isfull){
                     html[vdom[i].line-1] += tag
                  }else{
                     html[vdom[i].line-1] = tag
                  }
               }else{
                  var tag = `<${vdom[i].name} ${hattrs}>`
                  var isfull = html[vdom[i].line-1] != undefined
                  if(isfull){
                     html[vdom[i].line-1] += tag
                  }else{
                     html[vdom[i].line-1] = tag
                  }
               }
            }else{
               var tag = `<${vdom[i].name} ${hattrs}>`
                  var isfull = html[vdom[i].line-1] != undefined
                  if(isfull){
                     html[vdom[i].line-1] += tag
                  }else{
                     html[vdom[i].line-1] = tag
                  }
            }
            }else{
               var into = vdom[i].into
               var isifull = into != undefined
               if(isifull){
               var omark = this.allIndexOf(into,'<')
               if(omark.length == 0){
                  var tag = `<${vdom[i].name} >${into}`
                  var isfull = html[vdom[i].line-1] != undefined
                  if(isfull){
                     html[vdom[i].line-1] += tag
                  }else{
                     html[vdom[i].line-1] = tag
                  }
               }else{
                  var tag = `<${vdom[i].name} >`
                  var isfull = html[vdom[i].line-1] != undefined
                  if(isfull){
                     html[vdom[i].line-1] += tag
                  }else{
                     html[vdom[i].line-1] = tag
                  }
               }
            }else{
               var tag = `<${vdom[i].name} >`
                  var isfull = html[vdom[i].line-1] != undefined
                  if(isfull){
                     html[vdom[i].line-1] += tag
                  }else{
                     html[vdom[i].line-1] = tag
                  }
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
         this._html = htm
         return this._html
   }
         
   updateElement(elc){
      var eli = this.dom.indexOf(elc._dom)
      this.dom[eli] = elc.dom
   }
         
   listening(type,id,func){
      var scriptTag = this.dom.filter((tag)=>{
         return tag.name == 'script';
      })
      var isThereScript = scriptTag.length != 0
      if(isThereScript){
         for(var i=0;i <= scriptTag;i++){
            var checkSrc = scriptTag[i].src == undefined;
            if(checkSrc){
               var ti = this.dom.indexOf(scriptTag[i])
               console.log(ti)
            }
         }
      }else{
         var cthtm = this.dom.filter((tag)=>{
         return tag.name == 'html' && tag.type == 'close';
         })
         var oscriptage = {
            type: 'open',
            name: 'script',
            tag: { openTagIndex: 0, closeTagIndex:8 , tag: '<script >' },
            line: cthtm[0].line + 1
         }
         var funcstr = func.toString()
         oscriptage.into = funcstr
         var cscriptage = {
            type: 'close',
            name: 'script',
            tag: { openTagIndex:oscriptage.tag.closeTagIndex+funcstr.length , closeTagIndex:(oscriptage.tag.closeTagIndex+funcstr.length)+9, tag: '</script>' },
            line: oscriptage.line,
            openTag: { line: oscriptage.line, openIndex: oscriptage.tag.openTagIndex, closeIndex: oscriptage.tag.closeTagIndex, tag: '<script >' }
         }
         this.dom.push(oscriptage)
         this.dom.push(cscriptage)
         var elm = this.dom.filter((tag)=>{
         return tag.id == id || tag['class'] == id;
         })
         var indexof = this.dom.indexOf(elm[0])
         var targ = this.dom[indexof]
         targ[type] = func.name + '()'
         this.dom[indexof] = targ
         
      }
   }
   select(id){
      var el = this.dom.filter((tag)=>{
         return tag.id == id;
      })
      var elem = new elc(el)
      return elem;
   }
}

module.exports = Html