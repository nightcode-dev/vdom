# virdom 
welcome to virdom npm page(or github repository)
## what's virdom?

virdom is a html parser, it means you can use virdom to control html code
>It has some bugs and it cant give you a completely access to html like DOM 


## how to install?
first you need to install the module it isn't hard =)
you can use npm to install it :
```
npm install virdom
```
and in next step you should to required it in your project:
```
var virdom = require ('virdom')
```

## how to use it?
virdom is a class and you can make a new object from it and this class need a parameter for making
1. `path`: this parameter is the path of html file and this file will parse 
so our code is like this:
```
var virdom = require ('virdom')
var file = new virdom('./example.html')
```
now we get the path and ready to parse it but how?
its easy there is a method in virdom class and that's name is `render()`
what's that method work?that method will parse the file and save it in a json array in the class and the name of this array is `dom`
so our code be complete with this line:
```
file.render()
```
now let's test the module
our html code will be like this:
```
<html >
   <body >
      <h1 >hi world</h1>
   </body>
</html>
```
and our js code will be like this:
```
var virdom = require ('virdom')
var file = new virdom('./example.html')file.render()console.log(file.dom)
```
and the output will be like this:
```
         [{    type: 'open',    name: 'html',    tag: { openTagIndex: 0, closeTagIndex: 6, tag: '<html >' },    line: 1  },  {    type: 'open',    name: 'body',    tag: { openTagIndex: 3, closeTagIndex: 9, tag: '<body >' },    line: 2  },  {    type: 'open',    name: 'h1',    tag: { openTagIndex: 6, closeTagIndex: 20, tag: "<h1 id='text' >" },        line: 3,    id: 'text',    into: 'hi world'  },  {    type: 'close',    name: 'h1',    tag: { openTagIndex: 29, closeTagIndex: 33, tag: '</h1>' },    line: 3,                                                                    openTag: { openIndex: 6, closeIndex: 14, tag: "<h1 id='text' >" }  },  {    type: 'close',                                                              name: 'body',    tag: { openTagIndex: 3, closeTagIndex: 9, tag: '</body>' },    line: 4,    openTag: { line: 2, openIndex: 3, closeIndex: 9, tag: '<body >' }  },                                                                          {    type: 'close',    name: 'html',    tag: { openTagIndex: 0, closeTagIndex: 6, tag: '</html>' },    line: 5,    openTag: { line: 1, openIndex: 0, closeIndex: 6, tag: '<html >' }  }]
```
now we have a json array of html but when we change it how we can get a html code ?
its easy there is another method in virdom class and this method should to make a html code from the json array and the name of this method is `build()` 
so lets test it 
in last example we had html code and js code and now we want to add a line into our code 
so our code will be like this:
```
var virdom = require ('virdom')
var file = new virdom('./example.html')
file.render()
var html = file.build()
console.log(html)
```
and output is :
```
<html >
 <body > 
 <h1 id='text' >hi world</h1> 
 </body> 
 </html>
```
but its not all of virdom options 
sometimes we need a event listener and virdom has a option for this work

> i should to say my module cant help you completely for this work but you can use it

we have another method in virdom class ,this method can add a listener with html attribute and the name of this method is `listening()` and this method gets three parameters 
- **parameters**
1. `type` :this parameter gets the attribute of listener for example `onclick`

2. `id`:this parameter gets the id or class of a tag you select to add that attribute to it 

3. `function` : this parameter gets a function and thus function worked when event was called **don't forget you should to use known function and this option can't work with anonymous functions**
now we know the parameter and rules 
so lets to test it 
our html code was:
```
<html >
   <body >      
      <h1 id='text' >hi world</h1>   
   </body>
</html>
```
and our JavaScript code was:
```
var virdom = require ('virdom')
var file = new virdom('./example.html')
file.render()
var html = file.build()
console.log(html)
```
and we should to change code to this :
```
var virdom = require ('virdom')
var file = new virdom('./example.html')
file.render()
function hi(){ 
    console.log('hi')
}
file.listening('onclick','text',hi)
var html = file.build()
console.log(html)
```
so our output is:
```
<html >
 <body >
  <h1 id='text' onclick='hi()' >hi world</h1> 
  </body> 
  </html> 
  <script >function hi(){   console.log('hi')}
  </script>
```
## bugs 
>my module has some bugs besides it's features and if you want yo work with this module you have to use this rules in your code to dont get an error

1. use `''` for all of your attributes 
2. add a enter before `>` tag like this : `<h1 >`

# last talk
i tried to make this module for nodejs community and i hope you like it and use it 
if you like this module you can **star and follow or github** but your download of my module is enough too