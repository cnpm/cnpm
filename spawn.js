// copy from cross-spawn
var cp = require('child_process');

var isWin = process.platform === 'win32';

function escapeArg(arg, quote) {
    // If we are not going to quote the argument,
    // escape shell metacharacters, including double and single quotes:
    if (!quote) {
        arg = arg.replace(/([\(\)%!\^<>&|;,"' ])/g, '^$1');
    } else {
        // Sequence of backslashes followed by a double quote:
        // double up all the backslashes and escape the double quote
        arg = arg.replace(/(\\*)"/gi, '$1$1\\"');

        // Sequence of backslashes followed by the end of the string
        // (which will become a double quote later):
        // double up all the backslashes
        arg = arg.replace(/(\\*)$/, '$1$1');

        // All other backslashes occur literally

        // Quote the whole thing:
        arg = '"' + arg + '"';
    }

    return arg;
}

function escapeCommand(command) {
    // Escape shell metacharacters:
    command = command.replace(/([\(\)%!\^<>&|;, ])/g, '^$1');

    return command;
}

function spawn(command, args, options) {
    var applyQuotes;

    // Use node's spawn if not on windows
    if (!isWin) {
        return cp.spawn(command, args, options);
    }

    // Escape command & arguments
    applyQuotes = command !== 'echo';  // Do note quote arguments for the special "echo" command
    command = escapeCommand(command);
    args = (args || []).map(function (arg) {
        return escapeArg(arg, applyQuotes);
    });

    // Use cmd.exe
    args = ['/s', '/c', '"' + command + (args.length ? ' ' + args.join(' ') : '') + '"'];
    command = 'cmd';

    // Tell node's spawn that the arguments are already escaped
    options = options || {};
    options.windowsVerbatimArguments = true;

    return cp.spawn(command, args, options);
}

module.exports = spawn;
