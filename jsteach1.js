var getPosition;

function renderCanvas() {

    var canvas = $('canvas')[0];
    canvas.removeEventListener("mousedown", getPosition, false);
    var ctx = canvas.getContext('2d');
    
    //Pull inputs from form.
    var starti = Number($("#rangestart").val());
    var endi = Number($("#rangeend").val());
    var start = Number($('#start').val());
    var modifier = Number($("#modifier").val());
    var op = $('#operation').val();

    var w = canvas.width = window.innerWidth - 20;
    var h = canvas.height = 300;

    //Prevent Divide by zero error
    if (op == "/" && modifier == 0) {
        ctx.fillStyle = '#f0f0f0';
        ctx.font = "50px Arial";
        ctx.fillText("Divide by Zero Error!",(canvas.width/2)-200,(canvas.height/2)-100);
        drawSmiley();
        ctx.fillStyle = '#f0f0f0';
        ctx.fillText("THPPPT!!!",(canvas.width/2)-110,(canvas.height/2)+125);
        return;
    }

    //Extend Range if Calculation goes out of bounds.
    if (start < starti) {
        starti = start;
    } else if (start > endi) {
        endi = start;
    }

    var output;
    switch(op) {
        case "*":
            output = (start * modifier);
            break;
        case "+":
            output = (start + modifier);
            break;
        case "-":
            output = (start - modifier);
            break;
        case "/":
            if (Math.floor(start/modifier) < 0 && start > 0) {
                output = start*-1;
            } else {
                output = start;
            }
            break;
    }
    
    if (output > endi) {
        endi = output;
    }else if (output < starti) {
        starti = output;
    }

    var totRange = endi - starti;
    //Offset h to push numberline to bottom of canvas.
    h = h + 150;
    var x0 = w/2;
    var interval = Math.round((w/totRange)/1.5);//40;

    //Graphic: steps.
    var step = modifier;
    var steps = 1;
    //If Multiplication or Division, generate multiple hops.
    if (op == '*') {
        step = start;
        steps = modifier;
    }
    else if (op == '/') {
        steps = Math.floor(start/step);
        if (steps < 0) {
            steps = Math.ceil(start/step)
        }
        
        if ((steps < 0 && start > 0) || (steps > 0 && start < 0)) {
            start = start*-1;
            steps = steps*-1;
        }
    }

    function drawOperation(x, step, steps) {
        drawPoint(x);
        
        var tempSteps = steps;
        if (steps < 0) {
            tempSteps = steps*-1;
        }

        var tempInterval;
        if ((op == '*' && steps > 0) || op == '+' || (op == '/' && steps < 0)) { 
            //Multiply or Add hop forwards
            tempInterval = interval;
        } else {
            //Divide and Subtract hop backwards
            tempInterval = interval*-1;
        }
        
        for(var i = 0; i < tempSteps; i++){
            var label = '';
            if (op == '*' || op == '/') {
                //Label Hop count.
                label = i + 1;

                //Add remainder for division
                if (op == '/') {
                  //TODO: Not sure if this is correct, but it works for now.
                  //Problem is negative number modulo require ceil()
                  //while normally uses floor().
                  //Seems unneccessarily complex and inelegant.
                  if (((steps > 0 && i == (steps-1)) || (steps < 0 && i == (steps+1)*-1)) && Math.floor(start % step) > 0) {
                      label = label + ' (+' + Math.floor(start % step) + ')';
                  } else if (((steps > 0 && i == (steps-1)) || (steps < 0 && i == (steps+1)*-1)) && Math.ceil(start % step) < 0) {
                      label = label + ' (' + Math.ceil(start % step) + ')';
                  }
                }
            }
            drawCurve(x+i*step*tempInterval,x+(i+1)*step*tempInterval,label);
        }
        //TODO: This is a KLUGE: can't figure out how to place
        //the point in the right place for division where
        //base number is negative, and modifier positive.
        //(but works where base is positive/modifier negative)
        //It's probably something simple, but my brain is worn out.
        //Also breaks on multiplye: Base positive * modifier negative
        if ((op == '/' && tempInterval > 0) || (op == '*' && tempInterval < 0)) {
            drawPoint(x+(steps*-1)*step*tempInterval);
        } else {
            drawPoint(x+steps*step*tempInterval);
        }
    }

    function drawPoint(x1) {
        ctx.font="30px Arial";
        ctx.beginPath();
        ctx.arc(x1,h/2,10,0,2*Math.PI);
        ctx.fillStyle="red";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle="lightgreen";
    }

    getPosition = function(e) {
        var x = e.clientX;
        var xe = x - x % interval + 0;
        if(x0===0){  
            drawPoint(xe);
            x0=xe;
        }
        else{
            drawPoint(xe);
            drawCurve(x0,xe,'');
            x0=xe;
        }
    }

    function drawCurve(x1,x2,label) {
        ctx.moveTo(x1,h/2);
        var bezierY = h/2-Math.abs(x2-x1);
        var textY = h/2-Math.abs(x2-x1)*0.5-10;
        //Constrain Arc to inside canvas height.
        if (((x2-x1) > 0 && (x2-x1) > (h*0.75)) || ((x2-x1) < 0 && (x2-x1) < ((h*0.75)*-1))) {
            bezierY = -h*0.30;
            //TODO: I have no idea why this works.
            textY = bezierY*-0.25;
        }
        ctx.quadraticCurveTo(x1+(x2-x1)/2,bezierY,x2,h/2);
        var text;
        if (label != '') {
            text = label;
        } else {
            var s = Math.round((x2 - x1)/interval);
            if(s > 0){
                text = "+" + s.toString();
            }
            else {
                text = s.toString();
            }
        }
        ctx.fillText(text,x1+(x2-x1)/2,textY);

        ctx.stroke();
    }

    with(ctx) {

        ctx.font="25px Arial";
        fillStyle = 'indigo';
        fillRect(0, 0, w, h);
        fill();
        beginPath();
        lineWidth = 4;
        strokeStyle = 'fuchsia';
        moveTo(w/7, h/2);
        lineTo(6*w/7, h/2);
        stroke();  
        moveTo(w/7, h/2);
        lineTo(w/7+10, h/2+20);
        stroke();
        moveTo(w/7, h/2);
        lineTo(w/7+10, h/2-20);
        stroke();
        moveTo(6*w/7, h/2);
        lineTo(6*w/7-10, h/2+20);
        stroke();
        moveTo(6*w/7, h/2);
        lineTo(6*w/7-10, h/2-20);
        stroke();

        var k = Math.round((totRange/2)-totRange);
        for(var i = starti;i <= endi; i++) {
            beginPath();
            strokeStyle = '#0f0';
            lineWidth = 4;
            fillStyle = '#0f0';
            if(i == start) {
                //Highlight the Starting Point
                lineWidth = 7;
                strokeStyle = '#ff0';
                fillStyle = '#ff0';
                if (op != '*') {
                  //Set x0 to starting point
                  x0 = (h/2, w/2 + k * interval);
                }
            }
            if (i == 0 && op == '*') {
                //Set x0 to 0 for multiplication
                x0 = (h/2, w/2 + k * interval);
            }
            //Measuring lines
            moveTo(w/2 + k * interval, h/2 - 15);
            lineTo(w/2 + k * interval, h/2 + 15);
            //Line numbers.
            fillText(i, (w/2 + k * interval ) - 10, h/2 + 50);
            fill();
            stroke();
            k++
        }

    }

    function drawSmiley() {
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var radius = 70;
        var eyeRadius = 10;
        var eyeXOffset = 25;
        var eyeYOffset = 20;
        
        // draw the yellow circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'black';
        ctx.stroke();
          
        // draw the eyes
        ctx.beginPath();
        var eyeX = centerX - eyeXOffset;
        var eyeY = centerY - eyeXOffset;
        ctx.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
        var eyeX = centerX + eyeXOffset;
        ctx.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'black';
        ctx.fill();
        
        // draw the mouth
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, Math.PI, false);
        ctx.stroke();
    }

    canvas.addEventListener("mousedown", getPosition, false);

    drawOperation(x0,step, steps);
}

$(window).load(function (){renderCanvas();});

$(window).load(function(){
    // This button will increment the value
    $('.increment').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('#'+fieldName).val());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            $('#'+fieldName).val(currentVal + 1);
        } else {
            // Otherwise put a 0 there
            $('#'+fieldName).val(0);
        }
    });
    // This button will decrement the value till 0
    $(".decrement").click(function(e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('#'+fieldName).val());
        // If it isn't undefined
        if (!isNaN(currentVal)) {
            // Decrement one
            $('#'+fieldName).val(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $('#'+fieldName).val(0);
        }
    });
});
