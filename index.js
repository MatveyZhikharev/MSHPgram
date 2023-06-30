const dayjs = require('dayjs')

const express = require('express');
const app = express();
const port = 3005;


app.listen(port, function () {
    console.log(`http://localhost:${port}`);
});

// Настройка CORS
const cors = require('cors');
app.use(cors({origin: 'http://localhost:5173'}));


// Настройка POST-запроса — JSON
app.use(express.json());

// Настройка БД
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/mshpgram-app');

//Схемы
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        unique: true,
        type: String
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'src/assets/user.png'
    },
    sex: {
        type: String,
        default: 'Не указан'
    },
    birthday: Date
});

let User = mongoose.model('users', userSchema)


const messageSchema = new mongoose.Schema({
        text: String,
        user: {
            type: mongoose.ObjectId,
            ref: 'User'
        },
        reactions: {
            type: mongoose.ObjectId,
            ref: 'Reaction'
        }
    },
    {
        timestamps: true
    });


const chatSchema = new mongoose.Schema({
        title: String,
        users: [
            {
                type: mongoose.ObjectId,
                ref: 'User'
            }
        ],
        messages: [
            messageSchema
        ],
    },
    {
        timestamps: true
    })

let Chat = mongoose.model('chats', chatSchema)

//######################################################################################################
//######################################## К СОЖАЛЕНИЮ, НЕ УСПЕЛ( ######################################
//######################################################################################################
const reactionSchema = new mongoose.Schema({
    value: String,
});

let Reaction = mongoose.model('reactions', reactionSchema)
//#######################################################################################################
//#######################################################################################################

app.get('/users/all', async function (res, req) {
    res.send(await User.find())
})

app.post('/register', async function (req, res) {
    let {name, username, password, avatar, sex, date} = req.body
    let user = new User({
        name: name,
        username: username,
        password: password
    })
    if (date) {
        user.birthday = dayjs(date).toISOString()
    }
    if (avatar) {
        user.avatar = avatar
    }
    if (sex) {
        user.sex = sex
    }
    try {
        await user.save()
        res.send(user.username)
    } catch (e) {
        res.send('error')
    }
})

app.post('/user/edit', async function (req, res) {
    let {name, username, password, avatar, sex, date} = req.body
    let user = await User.findOne({
        username: username
    })
    user.name = name
    user.password = password
    user.birthday = dayjs(date).toISOString()
    user.avatar = avatar
    user.sex = sex
    try {
        await user.save()
        res.send(user.username)
    } catch (e) {
        res.send('error')
    }
})

app.post('/login', async function (req, res) {
    let {username, password} = req.body
    let user = await User.findOne({username: username})
    if (user.password === password) {
        res.send(user.username)
    } else {
        res.send('error')
    }
})

app.get('/chats/all', async function (req, res) {
    let {username} = req.query
    let user = await User.findOne({username: username})
    let response = await Chat.find({users: user._id}).sort({updatedAt: -1})
    res.send(response)
})

app.get('/chat', async function (req, res) {
    let {chatId} = req.query
    let chat = await Chat.findById(chatId)
    if (chat) {
        res.send(chat)
    } else {
        res.send('new')
    }
})

app.post('/chat/new', async function (req, res) {
    let {title, user, userNew} = req.body
    let userO = await User.findOne({username: user})
    let chat = new Chat({
        title: title,
        users: [userO]
    })
    let userObj = await User.findOne({username: userNew})
    if (userObj) {
        chat.users.push(userObj)
    }
    await chat.save()
    res.send(chat)
})

app.post('/chat/edit', async function (req, res) {
    let {chatId, title, userNew, userDelete} = req.body
    let chat = await Chat.findById(chatId)

    chat.title = title
    let userObj = await User.findOne({username: userNew})
    if (userObj) {
        chat.users.push(userObj._id)
    }
    let userD = await User.findOne({username: userDelete})
    if (userD) {
        for (let i = 0; i < chat.users.length; i++) {
            let u = await User.findById(chat.users[i])
            if (u.username === userD.username) {
                chat.users.splice(i, 1)
                break
            }
        }
    }
    await chat.save()

    res.send(chat)
})

app.post('/message', async function (req, res) {
    let {username, chat_id, message} = req.body
    let user = await User.findOne({username: username})
    let chat = await Chat.findById(chat_id)
    chat.messages.push({
        text: message,
        user: user
    })
    await chat.save()
    res.sendStatus(200)
})

app.get('/messages/all', async function (req, res) {
    let {chat} = req.query
    let response = await Chat.findById(chat).populate('messages')
    res.send(response.messages)
})

app.post('/user/id', async function (req, res) {
    let {username} = req.body
    let user = await User.findOne({
        username: username
    })
    res.send(user._id)
})

app.post('/user', async function (req, res) {
    let {id} = req.body
    let user = await User.findById(id)
    res.send(user)
})

app.post('/user/byUsername', async function (req, res) {
    let {username} = req.body
    let user = await User.findOne({
        username: username
    })
    res.send(user)
})
async function a() {
    let u = await User.findById("649ae491362106f59408465c")
    let m = new Message({
        "user": u
    })
    m.save()
    let c = await Chat.findById("649af207490e4f4f40dcfa1c")
    c.messages.push(m._id)
    c.save()
}

async function b() {
    let u = await User.findById("649ae491362106f59408465c")
    let c = new Chat({
        title: 'gsrip',
        users: [u]
    })
    c.save()
}
async function cl() {
    let c = await Chat.findOne({
        title: 'gsrip'
    })
    c.messages.push({
        text: 'dfg',
        user: "649ae491362106f59408465c"
    })
    await c.save()
}

// a()
// b()
// cl()