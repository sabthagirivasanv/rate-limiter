function refillTime(lastUpdated, sec){
    return Number(lastUpdated) + (sec*1000);
}

function addSecToTime(time, sec){
    return Number(time) + (sec*1000);
}


module.exports = {refillTime, addSecToTime}

