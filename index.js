const Discord = require('discord.js')
require('dotenv').config()
const client = new Discord.Client();
const PenduObject = require('./Pendu')
const Pendu = PenduObject.Pendu;
const guessOutcome = PenduObject.guessOutcome;
const gameState = PenduObject.gameState;

let penduGames = []

client.on('message', msg => {
    let guildID = msg.guild.id;
    if (!Object.keys(penduGames).includes(guildID)) {
        penduGames[guildID] = new Pendu();
    }

    let pendu = penduGames[guildID]

    if (msg.content[0] == ".") {
        let words = msg.content.trim().split(" ");
        let command = words[0].slice(1, words[0].length) || "";

        let letter = "";
        if (words[1] && words[1].length > 0)
            letter = words[1][0];
        let response = "";
        if (command == "pendu" || command == "p") {
            if (words.length >= 2 && words[1]) {
                pendu.init(words[1])
                msg.delete()
                msg.reply("New pendu game start with word: " + pendu.mask())
            } else {
                msg.reply(".startPendu <word>")
            }
        } else if (command == "guess" || command == "g") {
            if (pendu.state == gameState.PLAYING) {
                if (letter && letter != "") {
                    switch (pendu.newGuess(letter)) {
                        case guessOutcome.ALREADY_GUESSED:
                            response += "T'as des problèmes de mémoire ? Je pardonne pas: -1\n"
                            response += pendu.lifesLeft + " vies restantes"
                            break;
                        case guessOutcome.GOOD_GUESS:
                            response += "Nice !"
                            break;
                        case guessOutcome.BAD_GUESS:
                            response += pendu.lifesLeft + " vies restantes"
                            break;
                    }
                } else {
                    response += ".guess <letter>"
                }

                response = pendu.mask() + "\n" + response
                if (pendu.gameDone()) {
                    pendu.state = gameState.IDLE;
                    response += "\n" + "== Partie terminée =="
                    if (pendu.lifesLeft > 0) {
                        response += "\n" + "Tu as trouvé: " + pendu.answer
                    } else {
                        response += "\n" + "Le mot était: " + pendu.answer
                    }
                }
                msg.reply(response)

            } else {
                msg.reply("Aucun partie ne se joue en ce moment.")
            }
        } else {
            msg.reply("No command was found with the name: " + command)
        }
    }
})

client.login(process.env.BOT_TOKEN)