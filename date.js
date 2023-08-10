//jshint exversion:6

module.exports ={getDate:getDate,getDay:getDay};


function getDate(){
    const today = new Date();
    const options={
        weekday:'long',
        year:'numeric',
        month:'long',
        day:'numeric'
    };
    return today.toLocaleDateString('en-US',options);
}
function getDay(){
    const today = new Date();
    const options={
        weekday:'long',
    };
    return today.toLocaleDateString('en-US',options);
}
