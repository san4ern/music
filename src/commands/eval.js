module.exports = {
    name: 'eval',
    description: 'Eval.',
    aliases: ['e'],
    cooldown: 1,
    secret: true,
    async execute(message, args) {


        let code = args.join(" ");
        if(code.includes('await')) {
          code = '(async() => (' + code + '))()'
        }
    try {
        let preEval = process.hrtime.bigint()
      let evaled = await eval(code);
      let lastEval = process.hrtime.bigint()
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
        
      message.reply(["Code completed in " + `${(parseInt(String(lastEval - preEval)) / 1000000).toFixed(3)}` + "ms\n" + evaled.slice(0, 1900)], { code: "js" })
    } catch(e) {
      if (typeof(e) == "string") e = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
      let evalerror = new embed() 
      .setTitle("Произошла ошибка")
      .setDescription("`​``" + e + "`​``")
      .setColor('RED')
      message.reply(evalerror)
      
      }
        }
}