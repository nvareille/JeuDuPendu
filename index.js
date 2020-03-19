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
                console.log("Server", msg.guild.name)
                console.log("Answer", pendu.answer)
                msg.delete()
                msg.reply("Nouvelle partie de pendu démarrée avec le mot:\n " + pendu.mask())
            } else {
                msg.reply(".pendu <mot>")
            }
        } else if (command == "guess" || command == "g") {
            if (pendu.state == gameState.PLAYING) {
                if (letter && letter != "") {
                    switch (pendu.newGuess(letter)) {
                        case guessOutcome.ALREADY_GUESSED:
                            response += "T'as des problèmes de mémoire ? 🤭 Je pardonne pas: -1\n"
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

                response = checkGameOver(pendu, response)
                msg.reply(response)

            } else {
                msg.reply("Aucun partie ne se joue en ce moment.🙁\n Lances-en une avec .pendu <mot> ! 👌")
            }
        } else if (command == "oneshot" || command == "os") {

            if (pendu.state == gameState.PLAYING) {
                if (words[1]) {
                    switch (pendu.guessWord(words[1])) {
                        case guessOutcome.GOOD_GUESS:
                            response += "Je te tire mon chapeau 🤠!"
                            break;
                        case guessOutcome.BAD_GUESS:
                            response += "Bien essayé ! Mais c'est pas ça 😰: -2\n"
                            response += pendu.lifesLeft + " vies restantes"
                            break;
                    }
                    response = checkGameOver(pendu, response)
                    msg.reply(response)
                } else {
                    msg.reply("Aucun mot n'a été écrit, comment je fais moi ? 🤨\n .oneshot <mot>")
                }
            } else {
                msg.reply("Aucun partie ne se joue en ce moment.🙁\n Lances-en une avec .pendu <mot> ! 👌")
            }
        } else {
            msg.reply("Aucun commande n'a été trouvée avec ce nom: " + command + ". T'es sûre qu'elle existe ? 🤔")
        }
    }
})

function checkGameOver(pendu, response) {
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
    return response;
}

client.login(process.env.BOT_TOKEN)