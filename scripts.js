
	//Variables and arrays that need to be globally available
	var dateArray = []; //used in function makeXLabels
	var stopwords = ["a", "A", "also", "am", "an", "any", "and", "are", "as", "at", "be", "because", "but", "by", "can", "do", "for", "from", "have", "has", "i", "if", "in", "into", "is", "its", "it's", "last", "me", "my", "no", "nor", "not", "of", "on", "one", "or", "other", "our", "out", "put", "shall", "so", "than", "that", "the", "them", "their", "there", "these", "this", "those", "to", "us", "use", "used", "was", "we", "we", "what", "when", "were", "which", "who", "why", "where", "with", "would", "yes", "you", "your"];
	var stopWordsCaseSensitive = ["it", "It"];
	var punctuation = ["!", ".", ",", ":", ";", "-", "/", "\\", "(", ")", "[", "]", "{", "}", "_", "="];
	var stemChars = ["sses","ss","s","er","ing"];
	var docArray = [];
	
	
	
	
	/*************************
	Adds Dictionary object to javascript library.
	Taken from GLIS617 course, defined by Prof. Moffatt.
	**************************/
	
	

	function Dictionary () {
	  this.entries = {};
	}

	Dictionary.prototype.toString = function() {
	  var output = "\n";
	  var keys = Object.keys(this.entries);
	  for (var i = 0; i<keys.length; i++){
		output = output + keys[i] + ": ";
		var temp = this.entries[keys[i]];
		for (var j = 0; j < temp.length; j+=2) {
			output = output + "    " + temp[j] + " (" + temp[j+1] + ")    ";
			if (j < temp.length - 2) {
				output += "|";
			}
		}
		output = output + "\n";
	  }
	  return output;
	};
	
	Dictionary.prototype.toTable = function () {
		var table = "<table><tr><th>Word</th>";
		var keys = Object.keys(this.entries);
		var rows = keys.length;
		var cols = dateArray.length + 1;
		for (var i = 0; i < dateArray.length; i++) {
			table += "<th>" + dateArray[i] + "</th>";
		}
		table += "</tr>"
		for (var i = 0; i < rows; i++) {
			table += "<tr>";
			table += "<td>" + keys[i] + "</td>";
			var temp = this.entries[keys[i]];
			for (var j = 0; j < cols-1; j++) {
				//var cellContent = temp[j] + " (" + temp[j+1] + ")";
				var cellContent = getUniqueResult(dateArray[j], temp);
				table += "<td>" + cellContent + "</td>";
			}
			table += "</tr>";
		}
		table += "</table>";
		return table;
	}

	Dictionary.prototype.getKeys = function(){
	  return Object.keys(this.entries);
	};
	 
	Dictionary.prototype.contains = function(key) {
	  return (key in this.entries);
	};

	Dictionary.prototype.getValue = function(key) {
	  return this.entries[key];
	};

	Dictionary.prototype.add = function(key, value) {
	  this.entries[key] = value;
	};
	
	var invertedFiles = new Dictionary();




	// Function for accordion buttons
	function accordianFunction(id) {
		var x = document.getElementById(id);
		
		if (x.className.indexOf("w3-show") === -1) {
			x.className += "w3-show";
			this.classList.toggle("active");
		}
		else {
			x.className = x.className.replace("w3-show", "");
		}
	}
	
	//Function to control the nav buttons
	function openCity(evt, cityName) {
	  var i;
	  var x = document.getElementsByClassName("city");
	  for (var i = 0; i < x.length; i++) {
		 x[i].style.display = "none";
	  }
	  var activebtn = document.getElementsByClassName("testbtn");
	  for (var i = 0; i < x.length; i++) {
		  activebtn[i].className = activebtn[i].className.replace(" w3-theme-dark", "");
	  }
	  document.getElementById(cityName).style.display = "block";
	  evt.currentTarget.className += " w3-theme-dark";
	}

	var mybtn = document.getElementsByClassName("testbtn")[0];

	// Functions to display or hide the user selections 
	function displaySteps(id) {
		document.getElementById(id).style.display="";	
	}
	function hideSteps(id){
		document.getElementById(id).style.display = 'none';
	}


	/*********
	Functions used to create the X labels on the chart.
	*********/
	function makeXLabels() {
		var startDate = Number(prompt("Please indicate the start date: "));
		var interval = Number(prompt("Please indicate the interval: "));
		var repetitions = Number(prompt("Please indicate the number of repetitions: "));
		if (interval < 1) { 
			alert("Your interval is below 1. Please make it larger.");
			return false;
		}
		if (interval > 100) {
			alert("Your interval is above 100. Please make it smaller.");
			return false;
		}
		if (repetitions < 2) {
			alert("Your repetitions are below 2. You need at least 2 documents for this to make sense.");
			return false;
		}
		if (repetitions > 250) {
			alert("Your repetitions are above 250. Please select fewer documents.");
			return false;
		}
		for (var i = 0; i < repetitions; i++) {
			dateArray[i] = startDate + (i * interval);
		}
		dateArrayDisplayBox.innerText = "Your x-axis contains the following labels: \n"   + dateArray;
	}
	
	
	function readFile(event) {
		var content = event.target.files;
		for (var i = 0; i < content.length; i++) {
			var reader = new FileReader();
			reader.onload = function (event) {
				docArray[docArray.length] = event.target.result;
			}	
			reader.readAsText(content[i]);
		}
	}	
	
	
	/*********
	Function that applies both punctuation and stop words rules.
	Stemming uses RegExp functionality to find and replace the stemming characters.
	Returns a string that has been alphabetically sorted.
	*********/


	function removePunctuation(str){
	  var temp = [];
	  
	  for (var i = 0; i < punctuation.length; i++) {
		
		temp = str.split(punctuation[i]);
		str = temp.join(" ");
	  }
	  return str;
	}


	function removeStopWords(str){
	  var temp = [];
	  str = " " + str + " ";
	  for (var i = 0; i < stopwords.length; i++) {
		 temp = str.split(" " + stopwords[i] + " ");
		 str = temp.join(" ");
		 str = str.replace(/[0-9]\b/, "");
	  }
	  return str; 
	}
	
	function removeStopWordsCaseSensitive(str){
	  var temp = [];
	  str = " " + str + " ";
	  for (var i = 0; i < stopWordsCaseSensitive.length; i++) {
		 temp = str.split(" " + stopWordsCaseSensitive[i] + " ");
		 str = temp.join(" ");
	  }
	  return str; 
	}
	
	function removeExtraSpaces(str){
		return str.split(/\s+/g).join(" ").trim();
	}

	function tokenize(str){
	  var tokenArray = [];
	  str = removePunctuation(str);
	  str = removeStopWordsCaseSensitive(str);
	  str = str.toLowerCase();
	  str = removeStopWords(str);
	  str = removeExtraSpaces(str);
	  tokenArray = str.split(" ");
	 return tokenArray;
	}


	function updateArray(array, item) {
	  for (var i = 0; i < array.length; i++) {
		if (array[i] === item) {
			array[i+1] += 1;
			return array;
		}
	  }
	  array.push(item);
	  array.push(1);
	}
	

	function addWord(word, docID, inverted){
	  if (inverted.contains(word)) {
		temp = inverted.getValue(word);
		updateArray(temp, docID);
		inverted.add(word, temp);
	  }  
	  else {
		inverted.add(word, [docID, 1]);
	  }
	}

	function addDoc(doc, docID, inverted){
		var tempArray = tokenize(doc);
		for (var i = 0; i < tempArray.length; i++) {
			addWord(tempArray[i], docID, inverted);
		}  
	}

	function tidyContent(collection) {
		var inverted = new Dictionary();
		for (var i = 0; i < collection.length; i++) {
			addDoc(collection[i], dateArray[i], inverted);
		}  
		return inverted;
	}

	
	
	
	/*********
	Function that is used to create the full inverted file after selecting the
	button Create Inverted File. 
	*********/
	function createInvertedFile(){
		invertedFiles = tidyContent(docArray);
		//invertedFileBox.innerText = invertedFiles.toString();
		invertedFileBox.innerHTML = invertedFiles.toTable();
	}
		
	

	
	
	
	









