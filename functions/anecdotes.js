let fetch = require(`node-fetch`)

let buffer = [];
setup()



function getA(params) {
    setTimeout(gen, 10000 * Math.random())
    let a = buffer.shift();
    return a;
}

function setup() {
    for (let i = 1; i < 6 - buffer.length; i++) {
        setTimeout(gen, 5000 * i + 1000 * Math.random())
    }
}

function gen() {
    fetch("https://castlots.org/generator-anekdotov-online/generate.php", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,uk;q=0.6,ja;q=0.5",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "_ga=GA1.2.495309840.1600029536; _gid=GA1.2.487757344.1600029536; _ym_d=1600029536; _ym_uid=1600029536819948754; _ym_isad=1; _gat=1; _ym_visorc_29162025=w; _ym_visorc_26812653=b"
        },
        "referrer": "https://castlots.org/generator-anekdotov-online/",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "POST",
        "mode": "cors"
    })
        .then(res => res.json())
        .then(json => {
            buffer.push(json.success ? removeEnd(json.va) : "Anecdota machina broke")
        })
}

let removeEnd = (string) => {
    while (string.endsWith(`\n`)) {
        string = string.slice(0, -1);
    }
    return string
}

module.exports = { getA }