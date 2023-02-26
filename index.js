const TelegramBot = require("node-telegram-bot-api");
const BOT = new TelegramBot("6174075115:AAF1jNr133frCvjHtOXxl5zrALmkt8E74rY", { polling: true });
const FS = require("fs")
const USERINFO = require("./user-info.json");
const ADMIN = "5696184967"
let _money = 0
let counter = 0
let refCounter = 0;

let userExperience
let profileLink
let times
BOT.setMyCommands([
  { command: "/start", description: "запуск бота" },
  {
    command: "/channel",
    url: "https://t.me/+MG28AC6WlfpiNjFi",
    description: "перейти в канал",
  },
  {
    command: "/support",
    url: "https://t.me/Ivan_ZHukovv",
    description: "поддержка бота",
    callback_data: "supportBot ",
  },
]);

var options = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "регистрация", callback_data: "register" }],
      [{ text: "чат воркеров", url: "https://t.me/+MG28AC6WlfpiNjFi" }],
      [{ text: "поддержка бота", url: "t.me/SMOKEYNM" }],
      [{ text: "у меня есть реферальный код", callback_data: "ref" }]
    ],
  }),
};

var profile = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{text: "ваш профиль", callback_data: 'profile'}]
    ]
  })
}

var adminOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "посмотреть воркеров", callback_data: "showusers" }],
      [{ text: "узнать чат айди", callback_data: "message" }],
    ],
  }),
};

var acception = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "принять заявку", callback_data: "accept" }],
      [{ text: "отклонить заявку", callback_data: "decline" }],
    ],
  }),
};

function getExperience(msg) {
  const TEXT = msg.text;
  const USERCHATID = msg.chat.id;
  userExperience = TEXT;
  USERINFO.push({
    experience_count: times,
    profile_link: userExperience,
    time_for_work: profileLink,
    chat_id: CHATID,
    ref_code: msg.chat.id,
    money: _money
  })

  FS.writeFileSync("./user-info.json", JSON.stringify(USERINFO, null, "\t"))
  BOT.removeListener("message", getExperience)
  return BOT.sendMessage(msg.chat.id, "админ рассматривает вашу заявку")
}

function getProfileLink(msg) {
  const TEXT = msg.text
  profileLink = TEXT
  BOT.sendMessage(msg.chat.id, "2️⃣ пришли мне ссылку на профиль")
  BOT.on("message", getExperience)
  BOT.removeListener("message", getProfileLink)
  BOT.sendMessage("Админ рассматривает заявку")
}

function getTime(msg) {
  const TEXT = msg.text;
  times = TEXT;
  BOT.sendMessage(msg.chat.id, "3️⃣ сколько врмени вы готовы уделать работе пришлите цифрами в часах")
  BOT.on("message", getProfileLink)
  BOT.removeListener("message", getTime)
  return BOT.sendMessage(msg.chat.id, '', profile)
}

function sendUserData(msg) {
  const CHATID = msg.chat.id
  let users = JSON.parse(FS.readFileSync("./user-info.json", "utf8"));
  for (users in USERINFO) {
    let userExperience = USERINFO[users].experience_count
    let userProfileLink = USERINFO[users].profile_link
    let timeAtWork = USERINFO[users].time_for_work
    let refCode = USERINFO[users].ref_code
    let userMoney = USERINFO[users].money
    return BOT.sendMessage(CHATID, `Опыт: ${userExperience}\nВоркер: ${userProfileLink}\nВремя работы: ${timeAtWork}\nВаш реферальный код: ${refCode}\nВаш баланс: ${userMoney}$`, acception)
  }
}

function checkCode(msg){
  const TEXT = msg.text;
  const CHATID = msg.chat.id;
  for (key in USERINFO){
    if (TEXT == USERINFO[key].chat_id){
      BOT.sendMessage(CHATID, "ваш реферальный код одобрен")
      refCounter++;
    }else if (counter > 0) return BOT.sendMessage(CHATID, 'данный код уже был введен')

    else if (TEXT != USERINFO[key].chat_id) return BOT.sendMessage(CHATID, 'код не подтвержден')
  }
}

BOT.on("message",  (msg) => {
  const CHATID = msg.chat.id
  const TEXT = msg.text

  if (CHATID == "5770886713") {
    if (TEXT == "/start") return BOT.sendMessage(CHATID, `привет ${msg.from.first_name} ${msg.from.last_name} ваш статус: Админ`, adminOptions)
  } else {
    if (TEXT == "/start") return BOT.sendMessage(CHATID, `привет ${msg.from.first_name} ${msg.from.last_name}`, options)
  } 
})

BOT.on("callback_query", (msg) => {
  const CHATID = msg.from.id
  const ACTION = msg.data  
  const TEXT = msg.text

    if (ACTION == 'register'){     
      BOT.sendMessage(CHATID, `💎 Отлично! Перейдем к заполнению заявки\n впиши свой опыт работы`)
      BOT.on("message", getTime)
}

    if (ACTION == 'showusers'){
      BOT.sendMessage(CHATID, "вот список воркеров впишите что нибудь")
      BOT.on("message", sendUserData)
    }

    if (ACTION == 'accept'){
      for (key in USERINFO) {
        const LINKS = [
          `💎 Твой профиль ${USERINFO[key].chat_id}\n`,
          '⚡️ Ты можешь использовать метод "Обменник\n',
          "Реферальная ссылка: (https://t.me/+cWJy-yd5ijYxYjJi)",
          `Общий профит: ${_money}$`,
          `Кол-во профитов: ${counter}`,
          "🤖 Для навигации по боту - используй кнопки ниже",
          "🗣️ Все работает , желаем успешного ворка!",
          "📖 Как работать в нашей команде?\n",
          "👀 Наш обменный сервис— https://cryptocurrency.su\n",
          "🧠 Перед началом работы - ознакомься с мануалами:\n",
          "⚡️ Знакомство с командой — [https://teletype.in/@caveman/am13_mkFSEr]\n",
          "⚡️ Площадки для работы — [https://teletype.in/@caveman/KIQEaD69sZ8]\n",
          '⚡️ Метод "Обменник" — [https://teletype.in/@caveman/ke7FhpV-txv]\n',
          "⚡️ Стратегии/Техники работы — [https://teletype.in/@caveman/1PMIqsVdwTOь]\n",
          "⚡️ Примеры переписок— [https://teletype.in/@caveman/AFOiLgi1AO1]\n",
        ]
        BOT.sendMessage(USERINFO[key].chat_id, `${LINKS}`)
        BOT.sendMessage(CHATID, "текст был отправлен юзеру")
        _money += 100 + "$"
        console.log(_money)
        break;
      }
    }
    if(ACTION == 'decline') return BOT.sendMessage(msg.message.chat.id, `вы отклонили заявку`)
    

    if(ACTION == 'ref'){
      BOT.sendMessage(msg.message.chat.id, "введите ваш реферальный код")
      for (key in USERINFO){
        if (TEXT == USERINFO[key].chat_id){
            BOT.sendMessage(USERINFO[key].chat_id, "реферальный код одобрен", options)
            USERINFO[key].chat_id.money += 100;
          }else return BOT.sendMessage(USERINFO[key].chat_id, "реферальный код не одобрен")
          
          refCounter++;
          
      }
    if (refCounter > 0) return BOT.sendMessage(USERINFO[key].chat_id, "данный код уже был введен")
    
  }

  if (ACTION == 'profile') return BOT.sendMessage(message.chat.id, `Админ рассматривает вашу зявку, профиль будет доступен после одобрения вашей заявки`)

  
})

BOT.on("polling_error", console.log)
