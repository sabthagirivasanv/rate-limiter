function refillTime(lastUpdated, sec){
    return Number(lastUpdated) + (sec*1000);
}


module.exports = {refillTime}

