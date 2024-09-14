export function generateToken() {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
}

export function addSessionCookie() {
    const token = generateToken();
    const data = {
        "besedka": {
            "sessions": [
                { "token": token }
            ]
        }
    };
    document.cookie = `userSession=${encodeURIComponent(JSON.stringify(data))}; path=/;`;
    return token;
}

export function checkSessionCookie() {
    const name = "userSession=";
    const cookies = decodeURIComponent(document.cookie).split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(name) === 0) {
            const cookieValue = cookie.substring(name.length);
            const json = JSON.parse(cookieValue);
            if (json && json["besedka"] && json["besedka"]["sessions"] && json["besedka"]["sessions"].length > 0) {
                return json["besedka"]["sessions"][0];
            }
        }
    }
    return false;
}

export function clearSessionCookie() {
    document.cookie = `userSession=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
}
