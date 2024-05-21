var tspeed = 0
var rspeed = 100
var start_time = 0
var running0 = [0, 0, 0, 0]
var running1 = [0, 0, 0, 0, 0]

function setup_travelator() {
    document.getElementById("travelator").style.position = "absolute"
    document.getElementById("travelator-container").style.height = "225px"
    document.getElementById("travelator-container").style.width = "750px"
    document.getElementById("travelator-control-container").style.width = "750px"
    document.getElementById("travelator-control-container").style.marginTop = "50px"
    document.getElementById("travelator").style.height = "225px"
    document.getElementById("travelator").style.width = "750px"
    var content = ""
    content += "<img src='runner.png' style='width:50px;height:75px;position:absolute;top:20px;object-fit:none;object-position:0px 0px' id='runner0'>"
    content += "<img src='runner.png' style='width:50px;height:75px;position:absolute;top:140px;object-fit:none;object-position:0px 0px' id='runner1'>"
    content += "<div style='background-color:gray;width:700px;height:10px;position:absolute;top:95px;left:25px'></div>"
    content += "<div style='background-color:gray;width:700px;height:10px;position:absolute;top:215px;left:25px'></div>"
    content += "<div id='time0' style='position:absolute;width:50px;left:0;bottom:205px;text-align:center'></div>"
    content += "<div id='time1' style='position:absolute;width:50px;left:0;bottom:85px;text-align:center'></div>"
    for (var i = 0; i < 10; i++) {
        content += "<div id='tblip"+i+"' style='background-color:black;width:12px;height:10px;position:absolute;top:215px;left:" + (25 + i * 70) + "px'></div>"
    }
    content += "<div id='tblip-infty' style='background-color:black;width:0px;height:10px;position:absolute;top:215px;left:25px'></div>"

    document.getElementById("travelator").innerHTML = content
    document.getElementById("tspeed").value = tspeed
    document.getElementById("rspeed").value = rspeed
    setInterval(tick_travelator, 50)
}

function start_travelator() {
    start_time = Date.now()
    running0 = [start_time, start_time + 1000*700/rspeed, start_time + 1000 * 1400/rspeed, rspeed]
    running1 = [start_time, start_time + 1000*700/(rspeed+tspeed), start_time + 1000 * 700/(rspeed + tspeed), rspeed, tspeed]
    if (rspeed > tspeed) {
        running1[2] += 1000 * 700 / (rspeed - tspeed)
    } else {
        running1[2] = "none"
    }
}

function tick_travelator() {
    var time = Date.now()

    tenths = Math.floor((time - start_time) / 100)
    seconds = Math.floor(tenths / 10)
    tenths -= 10*seconds

    if (time < running0[1]) {
        document.getElementById("time0").innerHTML = seconds + "." + tenths + "s"
        document.getElementById("runner0").style.left = (time - running0[0]) * running0[0][3] / 1000 + "px"
        document.getElementById("runner0").style.objectPosition = (-50 * (1 + (10 * seconds + tenths)%4)) + "px 0px"
    } else if (time < running0[2]) {
        document.getElementById("time0").innerHTML = seconds + "." + tenths + "s"
        document.getElementById("runner0").style.left = (700 - ((time - running0[1]) * running0[0][3]) / 1000) + "px"
        document.getElementById("runner0").style.objectPosition = (-150 + 50 * ((10 * seconds + tenths)%4)) + "px -75px"
    } else {
        document.getElementById("runner0").style.left = "0px"
        document.getElementById("runner0").style.objectPosition = "0px 0px"
        tenths0 = Math.floor((running0[2] - running0[0]) / 100)
        seconds0 = Math.floor(tenths0 / 10)
        tenths0 -= 10*seconds0
        document.getElementById("time0").innerHTML = seconds0 + "." + tenths0 + "s"
    }
    document.getElementById("time0").style.left = document.getElementById("runner0").style.left

    if (time < running1[1]) {
        document.getElementById("time1").innerHTML = seconds + "." + tenths + "s"
        document.getElementById("runner1").style.left = (time - running1[0]) * (running1[0][3] + running1[0][4]) / 1000 + "px"
        document.getElementById("runner1").style.objectPosition = (-50 * (1 + (10 * seconds + tenths)%4)) + "px 0px"
    } else if (running1[2] == "none" || time < running1[2]) {
        document.getElementById("time1").innerHTML = seconds + "." + tenths + "s"
        if (running1[0][3] > running1[0][4]) {
            document.getElementById("runner1").style.left = (700 - ((time - running1[1]) * (running1[0][3] - running1[0][4])) / 1000) + "px"
        } else {
            document.getElementById("runner1").style.left = "700px"
        }
        document.getElementById("runner1").style.objectPosition = (-150 + 50 * ((10 * seconds + tenths)%4)) + "px -75px"
    } else {
        document.getElementById("runner1").style.left = "0px"
        document.getElementById("runner1").style.objectPosition = "0px 0px"
        tenths1 = Math.floor((running1[2] - running1[0]) / 100)
        seconds1 = Math.floor(tenths1 / 10)
        tenths1 -= 10*seconds1
        document.getElementById("time1").innerHTML = seconds1 + "." + tenths1 + "s"
    }
    document.getElementById("time1").style.left = document.getElementById("runner1").style.left

    var infty_used = false
    for (var i = 0; i < 10; i++) {
        left = (i * 70 + time * running1[0][4] / 1000) % 700
        document.getElementById("tblip" + i).style.left = (25 + left) + "px"
        if (left + 12 > 700) {
            document.getElementById("tblip" + i).style.width = (700 - left) + "px"
            document.getElementById("tblip-infty").style.width = (left - 688) + "px"
            document.getElementById("tblip-infty").style.display = "block"
            infty_used = true
        } else {
            document.getElementById("tblip" + i).style.width = "12px"
        }
    }
    if (!infty_used) {
        document.getElementById("tblip-infty").style.display = "none"
    }
}

function update_numbers() {
    var tsp = document.getElementById("tspeed").value / 1
    var rsp = document.getElementById("rspeed").value / 1

    if(Number.isInteger(tsp) && tsp >= 0){
        tspeed = tsp
        document.getElementById("tspeed").style.backgroundColor = "white"
    } else {
        document.getElementById("tspeed").style.backgroundColor = "red"
    }
    if(Number.isInteger(rsp) && rsp >= 0){
        rspeed = rsp
        document.getElementById("rspeed").style.backgroundColor = "white"
    } else {
        document.getElementById("rspeed").style.backgroundColor = "red"
    }

}
