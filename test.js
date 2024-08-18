<script>
document.addEventListener('DOMContentLoaded', function () {
    // Fetch the user's IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const userIp = data.ip;
            initializeTerminal(userIp);
        })
        .catch(error => {
            console.error('Error fetching IP address:', error);
            initializeTerminal('unknown');
        });

    function initializeTerminal(userIp) {
        // Create elements
        const body = document.body;
        body.style.margin = '0';
        body.style.fontFamily = 'monospace';
        body.style.backgroundColor = '#1e1e1e';
        body.style.color = '#dcdcdc';

        const terminal = document.createElement('div');
        terminal.style.backgroundColor = '#000';
        terminal.style.border = 'none';
        terminal.style.padding = '10px';
        terminal.style.width = '100vw';
        terminal.style.height = '100vh';
        terminal.style.overflowY = 'auto';
        terminal.style.whiteSpace = 'pre-wrap';
        terminal.style.color = '#dcdcdc';
        body.appendChild(terminal);

        const terminalOutput = document.createElement('pre');
        terminalOutput.id = 'terminal-output';
        terminalOutput.style.margin = '0';
        terminalOutput.style.fontSize = '12';
        terminalOutput.innerHTML = `
██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗    ████████╗ ██████╗      ██████╗██████╗  █████╗ ██████╗ ██████╗ ██╗   ██╗███╗   ███╗███████╗██╗
██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝    ╚══██╔══╝██╔═══██╗    ██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝████╗ ████║██╔════╝██║
██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗         ██║   ██║   ██║    ██║     ██████╔╝███████║██████╔╝██████╔╝ ╚████╔╝ ██╔████╔██║█████╗  ██║
██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝         ██║   ██║   ██║    ██║     ██╔══██╗██╔══██║██╔══██╗██╔══██╗  ╚██╔╝  ██║╚██╔╝██║██╔══╝  ╚═╝
╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗       ██║   ╚██████╔╝    ╚██████╗██║  ██║██║  ██║██████╔╝██████╔╝   ██║██╗██║ ╚═╝ ██║███████╗██╗
 ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝       ╚═╝    ╚═════╝      ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═════╝    ╚═╝╚═╝╚═╝     ╚═╝╚══════╝╚═╝

 
Instructions:
1. To list available commands, type: <span class="command">help</span>
2. To clear the terminal, type: <span class="command">clear</span>
3. Use the following commands for more information:
   - <span class="command">about</span> - Displays information about me
   - <span class="command">contact</span> - Displays contact information
   - <span class="command">learning</span> - Drafts for learning topics
   - <span class="command">skills</span> - Lists and runs available skills`;
        terminal.appendChild(terminalOutput);

        const inputArea = document.createElement('div');
        inputArea.style.display = 'flex';
        inputArea.style.alignItems = 'center';
        inputArea.className = 'blinking-cursor';
        terminal.appendChild(inputArea);

        const span1 = document.createElement('span');
        span1.innerHTML = `<span class="command">${userIp}@crabby.me:</span>`;
        inputArea.appendChild(span1);

        const tilde = document.createElement('span');
        tilde.textContent = '~';
        tilde.className = 'command';
        inputArea.appendChild(tilde);

        const dollarSign = document.createElement('span');
        dollarSign.textContent = '$';
        dollarSign.className = 'command';
        inputArea.appendChild(dollarSign);

        const commandInput = document.createElement('input');
        commandInput.type = 'text';
        commandInput.id = 'command-input';
        commandInput.placeholder = 'Enter command';
        commandInput.style.backgroundColor = '#000';
        commandInput.style.color = '#dcdcdc';
        commandInput.style.border = 'none';
        commandInput.style.outline = 'none';
        commandInput.style.flex = '1';
        commandInput.style.padding = '5px';
        commandInput.style.fontFamily = 'monospace';
        commandInput.style.caretColor = '#00ff00';  // Thicker cursor
        commandInput.autofocus = true;
        inputArea.appendChild(commandInput);

        // Blinking cursor effect
        const style = document.createElement('style');
        style.textContent = `
            .blinking-cursor::after {
                content: '|';
                animation: blink 1s step-end infinite;
                color: #00ff00;
                font-weight: bold;
            }

            @keyframes blink {
                from, to {
                    opacity: 1;
                }
                50% {
                    opacity: 0;
                }
            }

            .command {
                color: #00ff00;  /* Green color for commands */
            }

            .error {
                color: #ff0000;  /* Red color for errors */
            }
        `;
        document.head.appendChild(style);

        commandInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                processCommand(this.value, userIp);
                this.value = '';
            }
        });
    }

    const commands = ['help', 'clear', 'about', 'contact', 'learning', 'skills', 'run'];

    function processCommand(command, userIp) {
        const output = document.getElementById('terminal-output');
        const [cmd, option] = command.split(' ');

        let result = '';

        if (!commands.includes(cmd)) {
            const suggestion = findClosestCommand(cmd);
            if (suggestion) {
                result = `<span class="error">Command not found: ${cmd}. Did you mean ${suggestion}?</span>`;
            } else {
                result = '<span class="error">Invalid command. Type <span class="command">help</span> for available commands.</span>';
            }
        } else {
            switch (cmd) {
                case 'help':
                    result = `Available commands:
<span class="command">help</span> - Display this help message
<span class="command">clear</span> - Clear the terminal
<span class="command">about</span> - Displays information about me
<span class="command">contact</span> - Displays contact information
<span class="command">learning</span> - Drafts for learning topics
<span class="command">skills</span> - Lists and runs available skills`;
                    break;
                case 'clear':
                    output.innerHTML = '';
                    return;
                case 'about':
                    result = `Vihaan (known as Crabby or Crabby605 on the internet)
I play Minecraft and love photography.`;
                    break;
                case 'contact':
                    result = `Email: vihaanpingalkar4@proton.me
GitHub: Crabby605
Reddit: Crabby605
Discord: Crabby605`;
                    break;
                case 'learning':
                    result = `My Learning Journey
Here are some of the platforms and achievements from my learning journey:

EDX:
I'm on EDX learning Python using the CS50 course by Harvard and a Python course by MIT. I hope to finish and pass!

GitHub:
I'm on GitHub, check out my repositories here.

Hack Club:
Yes, I do have a Hack Club! If you want to see my development, check out my scrapbook here.

LeetCode:
Like any sensible person, I have a LeetCode account.

Google Cloud:
I have also learned to use Google Cloud. You can see my achievements down there.`;
                    break;
                case 'skills':
                    result = `Available skills:
1. Python: Hello, World!
2. Java: Hello, World!
3. JavaScript: Hello, World!
Use <span class="command">run <number></span> to see the code examples.`;
                    break;
                case 'run':
                    if (option) {
                        result = runSubCommand(option);
                    } else {
                        result = '<span class="error">Specify an option to run, e.g., <span class="command">run 1</span></span>';
                    }
                    break;
            }
        }

        output.innerHTML += `<br><span class="command">${userIp}@crabby.me:~$ ${command}</span><br>${result}`;
        document.body.querySelector('div').scrollTop = document.body.querySelector('div').scrollHeight;
    }

    function findClosestCommand(input) {
        const threshold = 3;  // Maximum allowed distance for suggestions
        let closest = null;
        let minDistance = Infinity;

        for (const cmd of commands) {
            const distance = getLevenshteinDistance(input, cmd);
            if (distance < minDistance && distance <= threshold) {
                minDistance = distance;
                closest = cmd;
            }
        }

        return closest;
    }

    function getLevenshteinDistance(a, b) {
        const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

        for (let i = 0; i <= a.length; i++) {
            for (let j = 0; j <= b.length; j++) {
                if (i === 0) {
                    dp[i][j] = j;
                } else if (j === 0) {
                    dp[i][j] = i;
                } else if (a[i - 1] === b[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1,
                        dp[i - 1][j - 1] + 1
                    );
                }
            }
        }

        return dp[a.length][b.length];
    }

    function runSubCommand(option) {
        const command = document.getElementById('command-input').value.split(' ')[0];
        switch (command) {
            case 'java':
                return runJavaSubCommand(option);
            case 'python':
                return runPythonSubCommand(option);
            case 'javascript':
                return runJavaScriptSubCommand(option);
            default:
                return '<span class="error">Invalid command.</span>';
        }
    }

    function runJavaSubCommand(option) {
        switch (option) {
            case '1':
                return `Star Triangle (Java):
       
       *
      ***
     *****
    *******
   *********`;
            case '2':
                return `Number Triangle (Java):
1
12
123
1234
12345`;
            case '3':
                return `Reverse Star Triangle (Java):
*******
******
*****
****
***
**
*`;
            default:
                return '<span class="error">Invalid option for Java.</span>';
        }
    }

    function runPythonSubCommand(option) {
        switch (option) {
            case '1':
                return `Star Triangle (Python):
1
22
333
4444
55555`;
            case '2':
                return `Reverse Star Triangle (Python):
*********
 *******
  *****
   ***
    *`;
            case '3':
                return `Diamond Shape (Python):
    *
   ***
  *****
 *******
*********
 *******
  *****
   ***
    *`;
            default:
                return '<span class="error">Invalid option for Python.</span>';
        }
    }

    function runJavaScriptSubCommand(option) {
        switch (option) {
            case '1':
                return `Star Triangle (JavaScript):
*
**
***
****
*****`;
            case '2':
                return `Reverse Star Triangle (JavaScript):
********
*******
******
*****
****
***
**
*`;
            case '3':
                return `Diamond Shape (JavaScript):
   *
  ***
 *****
*******
*******
 *****
  ***
   *`;
            default:
                return '<span class="error">Invalid option for JavaScript.</span>';
        }
    }
});
</script>
