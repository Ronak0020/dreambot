module.exports = async(client) => {
    console.log(`Oh yeah! ${client.user.username} is now online!`);

    client.user.setPresence({
        status: "online",
        activity: {
            name: "Legend loves DreamBaby",
            type: "STREAMING"
        }
    })
}
