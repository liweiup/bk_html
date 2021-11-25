function get_now_date() {
	var nowDate = new Date();
	var year = nowDate.getFullYear();
	var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1):nowDate.getMonth() + 1;
	var dayFlag = nowDate.getHours() < 19 ? 1 : 0;
	var day = nowDate.getDate() - dayFlag  < 10 ? "0" + nowDate.getDate() - dayFlag : nowDate.getDate() - dayFlag;
	var dateStr = year + "-" + month + "-" + day;
	return dateStr;
}

