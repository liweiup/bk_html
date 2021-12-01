//获取日期，天数
function getDay_common(day,act){
    act = act||0;
    var date1 = new Date(),
        time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
    var date2 = new Date(date1);
    date2.setDate(date1.getDate()+(day+1));

    let month   = date2.getMonth()+1;
    let strDate = date2.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if(act == 1){
        var time2 = date2.getFullYear()+"-"+ month +"-"+ strDate;
    }else{
        let hours = date2.getHours();
        let minutes = date2.getMinutes();
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }

        var time2 = date2.getFullYear()+"-"+ month +"-"+ strDate +" "+hours+":"+minutes;
    }
    return time2;
}

function get_now_date() {
	var dayFlag = new Date().getHours() < 19 ? -2 : -1;
    return getDay_common(dayFlag,1)
	return dateStr;
}