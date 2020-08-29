var TelegramBot = require('node-telegram-bot-api');
var token = '1098331287:AAHXtZBX5iskjKkgiAUBYjut_Jry4Ms0r2o';// token pego em @botfather
var bot = new TelegramBot(token, {polling: true});// run our bot on local
var request = require('request');

var mensagemPadrao = '/agendar (Titulo) ~ (Local) ~ (Horário e Data) ~ (descrição)\n';

var pessoas = [];
var titulo = '';
var local = '';
var horario = '';
var descricao = '';
var text = ''

bot.onText(/\/start/, function(msg){
    var chatId = msg.chat.id;
    console.log(msg);
    bot.sendMessage(chatId, 'Para agendar um evento faça\n' + mensagemPadrao + 'Lembre de colocar entre "~".' + '\nAbaixo o molde para copiar e alterar os campos!');
    bot.sendMessage(chatId, mensagemPadrao);
})

bot.onText(/\/agendar (.+)/, function(msg, match){
    var resultado = match[1].split("~");
    if(resultado.length > 3){
        titulo = resultado[0];
        local = resultado[1];
        horario = resultado[2];
        if(resultado.length === 4){
            descricao = resultado[3];
        }
    } else {
        bot.sendMessage(msg.chat.id, 'Por favor, escreva corretamente!');
        bot.sendMessage(msg.chat.id, mensagemPadrao);
    } 
    const opts = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Eu vou',
                // we shall check for this value when we listen
                // for "callback_query"
                callback_data: 'Adicionar'
              }
            ]
          ]
        }
      };
    bot.sendMessage(msg.chat.id, 
        '>>> Titulo: ' + titulo + 
        '\n\n>>> Local: ' + local + 
        '\n\n>>> Horário e Data: ' + horario + 
        '\n\n>>> Descrição:\n\n' + descricao + 
        '\n\nParticipantes:\n\n' + text
    , opts);
});

bot.onText(/\/numvo/, function(msg){
    const opts = { reply_to_message_id: msg.message_id };
    var inde = 0
    function Verificar(id) {
        pessoas.map((item, index) => {
            if(item.id === id){
                inde = index;
                return true;
            }
        })
        return false;
      }

    if(Verificar(msg.from.id)){
        pessoas.splice(inde);
        bot.sendMessage(msg.chat.id, 'Vacilão', opts);
    } else {
        bot.sendMessage(msg.chat.id, "Seu nome nem tava lá mesmo!", opts)
    }
})

bot.onText(/\/listar/, function(msg){
    const opts = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Eu vou',
                // we shall check for this value when we listen
                // for "callback_query"
                callback_data: 'Adicionar'
              }
            ]
          ]
        }
      };
    bot.sendMessage(msg.chat.id, 
        '>>> Titulo: ' + titulo + 
        '\n\n>>> Local: ' + local + 
        '\n\n>>> Horário e Data: ' + horario + 
        '\n\n>>> Descrição:\n\n' + descricao + 
        '\n\nParticipantes:\n\n' + text
    , opts);
})

// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Eu vou',
              // we shall check for this value when we listen
              // for "callback_query"
              callback_data: 'Adicionar'
            }
          ]
        ]
      }
    };
    let textAux = ''
    function Verificar(id) {
        pessoas.map((item) => {
            if(item.first_name === id){
                return false;
            } 
        })
        return true;
    }
    if(Verificar(callbackQuery.from.first_name)){
        if (action === 'Adicionar') {
            pessoas.push(callbackQuery.from);
            for (let index = 0; index < pessoas.length; index++) {
                textAux = textAux + `${index + 1} - ${pessoas[index].first_name}` + '\n'
            }
            text = textAux
        }
        bot.editMessageText( 
            '>>> Titulo: ' + titulo + 
            '\n\n>>> Local: ' + local + 
            '\n\n>>> Horário e Data: ' + horario + 
            '\n\n>>> Descrição:\n\n' + descricao + 
            '\n\nParticipantes:\n\n' + text
        , opts);
    } else {
        bot.sendMessage(msg.chat.id, "Seu nome já está na lista!");
    }
    
  
    
  });


// bot.onText(/\/love/, function onLoveText(msg) {
//     const opts = {
//       reply_to_message_id: msg.message_id,
//       reply_markup: JSON.stringify({
//         keyboard: [
//           ['Yes, you are the bot of my life ❤'],
//           ['No, sorry there is another one...']
//         ]
//       })
//     };
//     bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
//   });

//   // Matches /echo [whatever]
// bot.onText(/\/echo (.+)/, function onEchoText(msg, match) {
//     const resp = match[1];
//     bot.sendMessage(msg.chat.id, resp);
// });
