import {Message} from 'element-ui';

export function ValidCode(code) {
    if (code){
        Message.warning(codeMap.get(code));
    }
}
// 所有状态码数据
var codeMap = new Map();
codeMap.set(2000,"验证码为空或已过期")
codeMap.set(2005,"当前用户不存在")
codeMap.set(2006,"当前菜单不存在")
codeMap.set(2007,"当前角色不存在")

export default {
    ValidCode
}
