
$(document).ready(function(){
	//document.getElementById("usr").defaultValue = "-------------- Type your query here --------------";
	
	var Small = {
		'zero': 0,
		'one': 1,
		'two': 2,
		'three': 3,
		'four': 4,
		'five': 5,
		'six': 6,
		'seven': 7,
		'eight': 8,
		'nine': 9,
		'ten': 10,
		'eleven': 11,
		'twelve': 12,
		'thirteen': 13,
		'fourteen': 14,
		'fifteen': 15,
		'sixteen': 16,
		'seventeen': 17,
		'eighteen': 18,
		'nineteen': 19,
		'twenty': 20,
		'thirty': 30,
		'forty': 40,
		'fifty': 50,
		'sixty': 60,
		'seventy': 70,
		'eighty': 80,
		'ninety': 90
	};
	
	var words, num1=0, num2=0, rev=false, first=false, second=false, end=false;
	
	// Get the modal
	var modal = document.getElementById('myModal');
	var span = document.getElementsByClassName("close")[0];
	var dialog = $('#dialog');
	
	$('#action').click(function(){
		
		var query = document.getElementById('usr').value;
		
		if (query == "" || query == "-------------- Type your query here --------------") {
			alert('Please enter valid input!');
		} 
		else if( (query.search("teach") != -1) || (query.search("learn") != -1)  )	{
			if(query.search("subtract") != -1)
				window.location.href = "teach1.html";
		}
		else if( (query.search("test") != -1) || (query.search("quiz") != -1)  )	{
			if(query.search("number") != -1)
				window.location.href = "test1.html";
			if(query.search("subtract") != -1)
				window.location.href = "test2.html";
		}
		else {
			text2num(query);
		}
		
	});
	
	function text2num(str) {
		words = str.toString().split(/[\s]+/);
		words.forEach(feach);
		
		if( first && (end || second) )	{
			
			if(rev)	{
				num1 = num1 + num2;
				num2 = num1 - num2;
				num1 = num1 - num2;	
			}
			displayModal();
		}
		else {
			alert("Cannot process your query! Try again.");
		}
		
	}

	function feach(wrd) {
		var val = Small[wrd];
		if (!first)	{
			if ( !isNaN(parseInt(wrd)) )	{
				num1=parseInt(wrd);
			}
			else if (val != null) {
				num1 += val;
			}
			else if (wrd == "hundred") {
				num1 *= 100;
			}
			else if (wrd == "minus" || wrd == "-")	{ 
				first = true;
			}
			else if (wrd == "from") {
				first = true;
				rev = true;
			}
		}
		else if (!end) {
			if ( !isNaN(parseInt(wrd)) && !second)	{
				end = true;
				num2=parseInt(wrd);
			}
			else if (val != null) {
				second = true;
				num2 += val;
			}
			else if (wrd == "hundred") {
				second = true;
				num2 *= 100;
			}
		}
	}
	
	function displayModal() {

		var div1 = $('<h1>').append(num1 + ' - ' + num2 + ' = ' + (num1-num2));
		dialog.append(div1);
		dialog.append('<hr>');
		var div2 = $('<div>');
		var div4 = $('<div>');
		var div6 = $('<div>');
		
		if(num1<31 && num2<31)	{
			if(num1<num2)	{
				num1 = num1 + num2;
				num2 = num1 - num2;
				num1 = num1 - num2;	
			}
			var count;
			for(count=0; count<num1; count++)	{
				if(count%5 == 0)
					div2.append('<br/>');
				div2.append('<img id="countImg" src="user.png" />');
			}
			dialog.append(div2);
			
			var div3 = $('<div>');
			div3.append('<img id="signimg" src="minus.ico" />');
			dialog.append(div3);
			
			for(count=0; count<num2; count++)	{
				if(count%5 == 0)
					div4.append('<br/>');
				div4.append('<img id="countImg" src="user.png" />');
			}
			dialog.append(div4);
			
			var div5 = $('<div>');
			div5.append('<img id="signimg" src="equal.png" />');
			dialog.append(div5);
			
			for(count=0; count<(num1-num2); count++)	{
				if(count%5 == 0)
					div6.append('<br/>');
				div6.append('<img id="countImg" src="user.png" />');
			}
			dialog.append(div6);
		}
		
		else if(num1<1000 && num2<1000)	{
			if(num1<num2)	{
				num1 = num1 + num2;
				num2 = num1 - num2;
				num1 = num1 - num2;	
			}
			var count, mod, n1=num1, n2=num2, n3=(n1-n2);
			for(count=1; n1>=1; count*=10)	{
				mod = n1 % 10;
				while(mod--)	{
					if(count==1)
						div2.append('<img id="countImg" src="one.png" />');
					else if(count==10)
						div2.append('<img id="countImg" src="ten.png" />');
					else if(count==100)
						div2.append('<img id="countImg" src="hundred.jpg" />');
				}
				div2.append('<br/>');
				n1 = Math.floor(n1/10);
			}
			dialog.append(div2);
			
			var div3 = $('<div>');
			div3.append('<img id="signimg" src="minus.ico" />');
			dialog.append(div3);
			
			for(count=1; n2>=1; count*=10)	{
				mod = n2 % 10;
				while(mod--)	{
					if(count==1)
						div4.append('<img id="countImg" src="one.png" />');
					if(count==10)
						div4.append('<img id="countImg" src="ten.png" />');
					if(count==100)
						div4.append('<img id="countImg" src="hundred.jpg" />');
				}
				div4.append('<br/>');
				n2 = Math.floor(n2/10);
			}
			dialog.append(div4);
			
			var div5 = $('<div>');
			div5.append('<img id="signimg" src="equal.png" />');
			dialog.append(div5);
			
			for(count=1; n3>=1; count*=10)	{
				mod = n3 % 10;
				while(mod--)	{
					if(count==1)
						div6.append('<img id="countImg" src="one.png" />');
					if(count==10)
						div6.append('<img id="countImg" src="ten.png" />');
					if(count==100)
						div6.append('<img id="countImg" src="hundred.jpg" />');
				}
				div6.append('<br/>');
				n3 = Math.floor(n3/10);
			}
			dialog.append(div6);
		}
		
		modal.style.display = "block";
	}
	
	span.onclick = function() {
		location.reload();
		modal.style.display = "none";
	}
	
	window.onclick = function(event) {
		if (event.target == modal) {
			location.reload();
			modal.style.display = "none";
		}
	}
	
});
