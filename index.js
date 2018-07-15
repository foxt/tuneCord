const DiscordRPC = require("discord-rpc")
const osa = require("applescript")
var rpc = new DiscordRPC.Client({ transport: 'ipc' });
function runOSA(script) {
    return new Promise(function(a,r) {
        osa.execString(script, (err, rtn) => {
            if (err) {
                r(err)
            }
            a(rtn)
        });
    })
}
function hmsToSecondsOnly(str) {
    var p = str.split(':'),
    s = 0, m = 1;
    
    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    
    return s;
}
var loggedIn = false

async function thing() {
    var trackName = await runOSA('tell application "iTunes" to get name of current track')
    var artist = await runOSA('tell application "iTunes" to get artist of current track')
    var album = await runOSA('tell application "iTunes" to get album of current track')
    
    var start = await runOSA('tell application "iTunes" to get player position')
    var end = await runOSA('tell application "iTunes" to get time of current track')
    var now = new Number(new Date()) / 1000;
    var actualStart = now - start
    var realEnd = actualStart + hmsToSecondsOnly(end)
    console.log("Sending RP to Discord (",trackName,"by",artist,")")
    
    rpc.setActivity({
        details: `🎵  ${trackName}`,
        state: `👥  ${artist}`,
        timestamps: {
            start: actualStart,
        },
        largeImageKey: 'itunes',
        largeImageText: `💿  ${album}`,
        smallImageKey: 'logo',
        smallImageText: 'Tunecord by theLMGN',
        instance: false,
    });
    loggedIn = true
}

rpc.on('ready', async () => {
    thing()
})
async function setActivity() {

    var playing = await runOSA('tell application "iTunes" to get player state')
    if (playing == "playing") { 
        if (!loggedIn) {
            rpc.login("404277856525352974").catch(console.error);
        } else {
            thing()
        }
        
    } else {
        
        if (loggedIn == true) {
            rpc.transport.close()
            loggedIn = false
        }
        console.log("Nothing playing")
        
    }

}


setActivity();

// activity can only be set every 15 seconds
setInterval(() => {
    setActivity();
}, 15000);

