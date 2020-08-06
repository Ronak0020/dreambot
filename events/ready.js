module.exports = async(client) => {
    console.log(`Oh yeah! ${client.user.username} is now online!`);

    client.user.setPresence({
        status: "dnd",
        activity: {
            name: "Legend loves DreamBaby 💖",
            type: "WATCHING"
        }
    })
}
