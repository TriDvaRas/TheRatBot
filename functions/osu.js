let fetch = require(`node-fetch`)
let { osuToken, osuTokenV1 } = require(`../config.json`)
let ojsama = require("ojsama");
let Discord = require(`discord.js`);
const { response } = require("express");
let auth = null
let headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
}

function getToken() {
    return new Promise((resolve, reject) => {
        if (auth?.expiresAt > Date.now())
            resolve(auth.access_token)
        else
            fetch("https://osu.ppy.sh/oauth/token", {
                method: 'post',
                headers,
                body: JSON.stringify({
                    "grant_type": "client_credentials",
                    "client_id": 5074,
                    "client_secret": osuToken,
                    "scope": "public"
                })
            })
                .then(response => response.json())
                .then(json => {
                    auth = {
                        expiresAt: json.expires_in + Date.now(),
                        access_token: json.access_token
                    }
                    resolve(auth.access_token)
                })
                .catch(reject)

    })
}

function getRecents(userId, options) {
    let { lim, off, fail } = options
    return new Promise((resolve, reject) => {
        getToken().then(token => {
            headers.Authorization = `Bearer ${token}`
            fetch(`https://osu.ppy.sh/api/v2/users/${userId}/scores/recent?include_fails=${fail ? 1 : 0}&limit=${lim}&offset=${off}`, {
                method: "GET",
                headers,
            })
                .then(response => response.json())
                .then(resolve)
                .catch(reject)
        })

    })
}

function getV1User(userName) {
    return new Promise((resolve, reject) => {
        fetch(`https://osu.ppy.sh/api/get_user?u=${userName}&k=${osuTokenV1}`, {
            method: 'get',
            headers
        })
            .then(response => response.json())
            .then(json => resolve(json[0]))
            .catch(reject)
    })
}

function getV1Beatmap(beatmapId) {
    return new Promise((resolve, reject) => {
        fetch(`https://osu.ppy.sh/api/get_beatmaps?b=${beatmapId}&k=${osuTokenV1}`, {
            method: 'get',
            headers
        })
            .then(response => response.json())
            .then(json => resolve(json[0]))
            .catch(reject)
    })
}

function formatScore(score, beatmap, pp, options) {
    let { rich } = options
    //console.log(score);
    let embeed = new Discord.MessageEmbed()
        .setAuthor(`${score.user.username}`, `${score.user.avatar_url}`, `https://osu.ppy.sh/users/${score.user_id}`)
        // .setThumbnail(`${score.beatmapset.covers[`list@2x`]}`)
        .setColor(getColor(score.rank))

        .setDescription(`**[${beatmap.artist} - ${beatmap.title} [${beatmap.version}]](${score.beatmap.url})**`)
        .setImage(`${score.beatmapset.covers[`cover@2x`]}`)
        .addField(`Acc`, `${Math.round(score.accuracy * 10000) / 100}%`, true)
        .addField(`Combo`, `${score.max_combo}x/${beatmap.max_combo}x`, true)
        .addField(`Score`, `${score.score}`, true)
        .addField(`Real pp`, `**${Math.round(score.pp * 100) / 100}pp**` || `-`, true)
        .addField(`Aprox pp`, pp.sum || `-`, true)
        .addField(`Mods`, `${score.mods?.length == 0 ? `nomod` : `${score.mods.join(``)}`}`, true)
        .addField(`Hits`, `${score.statistics.count_300} / ${score.statistics.count_100} / ${score.statistics.count_50} / ${score.statistics.count_miss}`, false)
    if (rich)
        embeed.addField(`Aim pp`, pp.aim, true)
            .addField(`Speed pp`, pp.speed, true)
            .addField(`Acc pp`, pp.acc, true)
    embeed.addField(`Beatmap Info`, getBeatmapInfo(score, beatmap))

    return embeed
}

function getColor(rank) {
    switch (rank) {
        case `SSH`:
            return `#F0BB18`
        case `SS`:
            return `#F0BB18`
        case `SH`:
            return `#E9D422`
        case `S`:
            return `#E9D422`
        case `A`:
            return `#1BE016`
        case `B`:
            return `#164AE0`
        case `C`:
            return `#CD0DD4`
        case `D`:
            return `#D40D16`
        case `F`:
            return `#682D09`
        default:
            break;
    }
}

function getBeatmapInfo(score, beatmap) {
    return `Length: \`${Math.floor(score.beatmap.hit_length / 60)}:${score.beatmap.hit_length % 60 > 9 ? score.beatmap.hit_length % 60 : `0${score.beatmap.hit_length % 60}`} (${Math.floor(score.beatmap.total_length / 60)}:${score.beatmap.total_length % 60 > 9 ? score.beatmap.total_length % 60 : `0${score.beatmap.total_length % 60}`})\`   BPM: \`${score.beatmap.bpm}\`  Objects: \`${score.beatmap.count_circles + score.beatmap.count_sliders + score.beatmap.count_spinners}\`\n` +
        `CS: \`${score.beatmap.cs}\`  AR: \`${score.beatmap.ar}\`  OD: \`${score.beatmap.accuracy}\`  HP: \`${score.beatmap.drain}\`  Stars: \`${score.beatmap.difficulty_rating}\`  `
}

function getPP(score, beatmap) {
    return new Promise((resolve, reject) => {
        let parser = new ojsama.parser()
        fetch(`https://osu.ppy.sh/osu/${beatmap.beatmap_id}`)
            .then(res => res.text())
            .then(body => {
                parser.feed(body)
                // let lines = body.split('\n')
                // lines.forEach(parser.feed_line)
                if (parser.map.objects.length == 0)
                    return resolve(`Бля)`)
                let maxpp = ojsama.ppv2({
                    map: parser.map,
                    mods: ojsama.modbits.from_string(`${score.mods?.length == 0 ? `` : `${score.mods.join(``)}`}`),
                })
                let actpp = ojsama.ppv2({
                    map: parser.map,
                    nsliders: parser.map.nsliders,
                    ncircles: parser.map.ncircles,
                    nobjects: parser.map.nspinners + parser.map.nsliders + parser.map.ncircles,
                    max_combo: beatmap.max_combo,
                    combo: score.max_combo,
                    // stars: +beatmap.difficultyrating,
                    aim_stars: +beatmap.diff_aim,
                    speed_stars: +beatmap.diff_speed,
                    nmiss: +score.statistics.count_miss,
                    n50: +score.statistics.count_50,
                    n100: +score.statistics.count_100,
                    n300: +score.statistics.count_300,
                    acc_percent: +score.accuracy,
                    mods: ojsama.modbits.from_string(`${score.mods?.length == 0 ? `` : `${score.mods.join(``)}`}`),
                })
                resolve({
                    sum: `${Math.round(actpp.total * 100) / 100}pp / ${Math.round(maxpp.total * 100) / 100}pp`,
                    aim: `${Math.round(actpp.aim * 100) / 100}pp / ${Math.round(maxpp.aim * 100) / 100}pp`,
                    speed: `${Math.round(actpp.speed * 100) / 100}pp / ${Math.round(maxpp.speed * 100) / 100}pp`,
                    acc: `${Math.round(actpp.acc * 100) / 100}pp / ${Math.round(maxpp.acc * 100) / 100}pp`,
                })
            })
    })
}

module.exports = {
    getRecents,
    formatScore,
    getV1Beatmap,
    getPP,
    getV1User,
}