export function formatYYYYMMddHHmmSS(dateStr) {
    var date = new Date(dateStr);
    return formatDate(date,'yyyy-MM-dd hh:mm:ss');
}

function formatDate(date,fmt){
    if(/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (date.getFullYear()+'').substr(4-RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth()+1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for(let k in o){
        let str = o[k]+'';
        if(new RegExp(`(${k})`).test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1)?str:padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str){
    return ('00'+str).substr(str.length);
}
export function formatYYYYMMdd(dateStr) {
    var date = new Date(dateStr);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return formatDate(date,'yyyy-MM-dd');
}

export default {
    formatYYYYMMddHHmmSS,formatYYYYMMdd
}