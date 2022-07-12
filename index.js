import inquirer from "inquirer";
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid';
import chalk from "chalk";

const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()

db.data ||= { users: [] }  


const inputs = [
    {
        type: "input",
        name: "username",
        message: "Enter your username: ",
    },
    {
        type: "input",
        name: "email",
        message: "Enter your email: ",
        validate(value) {
            const regex = value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
            if (regex) {
                return true
            }
            return 'Please enter a valid email'
        }
    }
]



inquirer.prompt(inputs).then((answers) => {
    const user = {
        id: uuidv4(),
        username: answers.username,
        email: answers.email,
    }
    db.data.users.push(user)

    db.write()
    console.log((chalk.green('User ' + chalk.underline.blue(`${user.username}`) + ' created 🚀')))
});