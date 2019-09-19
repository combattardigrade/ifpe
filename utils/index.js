module.exports.sendJSONresponse = function(res, status, content) {
    res.status(status)
    res.json(content)
}

module.exports.checkSequentialCharacters = function(s) {
    // check for sequential numerical characters
    for(let i in s) {
        if(+s[+i+1] == +s[i]+1 && +s[+i+2] == +s[i]+2)
            return false
    }
    
    // check for sequential alphabetical characters
    for(let i in s) {
        if (String.fromCharCode(s.charCodeAt(i)+1) == s[+i+1] && 
            String.fromCharCode(s.charCodeAt(i)+2) == s[+i+2]){
                return false
            }            
    }
    
    // check if characters are repeat more than twice
    if( /([A-Za-z0-9])\1{2}/.test(s) )    {
        return false
    }    
        
    return true
}

function newFunction() {
    console.log('test');
}
