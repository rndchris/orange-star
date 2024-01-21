export const authInfo = {
    reverseProxy: reverseProxyValue(),
    userHeader: process.env.REVERSE_PROXY_USER_HEADER,
    user: forcedUser()
  }

export default authInfo;

function reverseProxyValue(){
    if (process.env.REVERSE_PROXY_AUTH == "true"){
        return true;
    } else {
        return false;
    }
}

function forcedUser(){
    let forcedUser = process.env.NO_AUTHENTICATION_FORCED_USER;
    if (forcedUser){
        return forcedUser;
    } else {
        return null;
    }
}