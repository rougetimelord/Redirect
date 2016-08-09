var success;
document.addEventListener("DOMContentLoaded", addListeners);
function addListeners(){
var t1 = document.getElementById('test1');
var t2 = document.getElementById('test2');
var t3 = document.getElementById('test3');
var tC = document.getElementById('testC');
t1.addEventListener("click",function(){success=[["abc.com","abc.net","abc.info","abc.com"],["abccares.com","abc.org"]];redirect([["abc.com","abc.com"],["abc.net","abc.com"],["abc.info","abc.com"],["abccares.com","abc.org"]])});
t2.addEventListener("click",function(){success=[["abc.com","abc.name","abc.net","longwebname.com"],["some.thing","some.things"]];redirect([["abc.com","longwebname.com"],["abc.name","abc.net"],["abc.net","longwebname.com"],["some.thing","some.things"]])});
t3.addEventListener("click",function(){success=[["ab.c","abc.net","abcnew.com","abc.dj","abc.com"]];redirect([["ab.c","abc.dj"],["abc.net","abc.com"],["abcnew.com","abc.net"],["abc.dj","abcnew.com"]])});
tC.addEventListener("click",function(){success=stringToArray(document.getElementById('custSucc').value);redirect(stringToArray(document.getElementById('custIn').value))});
}
function stringToArray(a){
	if(a.length == 0)
		throw 'Empty string';
	var result = new Array();
	var temp = a.split('*')
	for(var i = 0; i < temp.length; i++){
		var temp2 = temp[i].split(',')
		result.push(temp2);
	}
	return result;
}
var run = 1;
var depth = 0;
function climbRedirTree(a,b){
	console.log("entry ",b,depth);
	for(var i = 0; i < a.length; i++){
		if(a[i].indexOf(b) === 0 && a[i][1] != b)
		{
			console.log("leaving from ",b);
			b = a[i][1];
			console.log("going to ",b);
			depth++;
			b = climbRedirTree(a,b);
			depth--;
			break;
		}
	}
	return b;
}
function redirect(inputArr){
	console.groupCollapsed("Run " + run)
	var redirList = new Array();
	var tosList = new Array();
	for(var i=0; i < inputArr.length; i++){
		var currRedir = inputArr[i];
		var from = currRedir[0]
		var to = currRedir[1];
		console.log(from, " leads to ", to, " before climbing");
		console.groupCollapsed("Redir climbing")
		to = climbRedirTree(inputArr,to)
		console.groupEnd("Redir climbing")
		console.log(from, " leads to ", to, " after climbing");
		var toInd = tosList.indexOf(to);
		if(toInd == -1){
			redirList.push(new Redir([from,to]));
			tosList.push(to);
		}
		else{
			if(!redirList[toInd].from.includes(from))
				redirList[toInd].from.push(from);
		}
	}
	var result = new Array();
	for(var i = 0; i < redirList.length; i++){
		var temp = new Array();
		var froms = redirList[i].from;
		for(var i2 = 0; i2 < froms.length; i2++)
			temp.push(froms[i2]);
		temp.push(redirList[i].to);
		result.push(temp);
	}
	console.groupEnd("Run " + run)
	check(result);
}
function Redir(a){
	this.from = new Array();
	this.from.push(a[0]);
	this.to = a[1];
}
function arrToString(a){
	var result = "[";
	for(var i = 0; i < a.length; i++){
		result += "[";
		for(var i2 = 0; i2 < a[i].length; i2++){
			result += '"' + a[i][i2] + '"';
			if(i2 < a[i].length - 1)
				result += ",";
		}
		result += "]";
		if(i < a.length - 1)
			result += ",";
	}
	result += "]";
	return result;
}
function check(a){
	var classN;
	var match = true;
	if(success.length == a.length){
		for(var i = 0; i < success.length; i++)
		{
			var curr = success[i], currA = a[i]; 
			if(curr.length != currA.length){
				match = false;
				break;
			}
			for(var i2 = 0; i2 < curr.length; i2++){
				if(curr[i2] == currA[i2])
					continue;
				match = false;
				break;
			}
			if(!match)
				break;
		}
	}
	else
		match = false;
	if(match)
		classN = "success";
	else
		classN = "fail";
	var p = document.createElement('p');
	p.className = classN;
	p.innerText = "Run " + run + " " + classN + "ed " + arrToString(success) + " " + arrToString(a);
	document.getElementById('result').appendChild(p);
	run++;
}
