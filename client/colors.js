orangeYelow="#faa300"; 
lightBlue="#00b7ed";
green="#b1c900";
darkPurple="#114b5f";
yelow="#f5e636";
blue="#0c00ba";
orangeRed="#b54a09";
purple="#e37dac";
beuge="#ff8286"

gray="#b2b2b2";
black="#000000";

function GetDefaultColors(){
    var colors = new Array(8);
    colors[0]=orangeYelow; 
    colors[1]=lightBlue; 
    colors[2]=green; 
    colors[3]=darkPurple; 
    colors[4]=yelow; 
    colors[5]=blue; 
    colors[6]=orangeRed; 
    colors[7]=purple; 
    return colors;
}

function GetBlack(){
    var colors = new Array(8);
    i=0;
    while(i<8)colors[i++]=black;
    return colors;
}

exports.defaultColors = GetDefaultColors();
exports.blackColors = GetBlack();

exports.orangeYelow = orangeYelow;
exports.lightBlue = lightBlue;
exports.green = green;
exports.darkPurple = darkPurple;
exports.yelow = yelow;
exports.blue = blue;
exports.orangeRed = orangeRed;
exports.purple = purple;

exports.gray = gray;
exports.black = black;