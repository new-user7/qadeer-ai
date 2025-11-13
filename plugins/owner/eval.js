const { spawn } = require("child_process");
const util = require("util");

const handler = async (m, sock, { text, args, command, reply, isOwner }) => {
  if (!isOwner) return reply(mess.owner); // 'mess.owner' is defined in settings.js (already translated)
  if (!args || !args.length) return reply(`where is the code?`);

  try {
    switch (command) {
      case "exec":
      case "shell":
      case "$": {
        const cmdString = args.join(" ");
        const commandParts = cmdString.split(" ");
        const cmdName = commandParts[0];
        const cmdArgs = commandParts.slice(1);
        if (!cmdName) return reply("Invalid command.");

        const execProcess = spawn(cmdName, cmdArgs, {
          cwd: process.cwd(),
          shell: false,
          stdio: ["pipe", "pipe", "pipe"],
        });

        let stdout = "";
        let stderr = "";

        execProcess.stdout.on("data", (data) => (stdout += data.toString()));
        execProcess.stderr.on("data", (data) => (stderr += data.toString()));

        const timeout = setTimeout(() => {
          execProcess.kill("SIGTERM");
          stderr += "\n[!] Command terminated: took too long to run.";
        }, 15000);

        execProcess.on("close", (code) => {
          clearTimeout(timeout);
          let output = "";
          if (code === 0 && stdout.trim()) output = stdout.trim();
          else if (stderr.trim()) output = stderr.trim();
          else output = "No output.";
          reply("```" + output + "```");
        });

        execProcess.on("error", (err) => {
          clearTimeout(timeout);
          reply("Error running command:\n```" + err.message + "```");
        });
      }
      break;
      
      case "eval":
      case "ev":
      case "=": {
        const code = args.join(" ");
        if (!code) return reply("Where is the code!");

        let script;
        if (/let|var|const|return|await/.test(code)) script = `(async () => {\n${code}\n})()`;
        else script = code;

        const result = await eval(script);
        reply(util.format(result));
      }
      break;
    }
  } catch (err) {
    reply("❌ Error:\n" + err.message);
  }
};

handler.command = ["exec", "shell", "$", "eval", "ev", "="];
module.exports = handler;
