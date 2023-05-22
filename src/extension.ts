// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { StatusBarAlignment, StatusBarItem, window } from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "buttonzi" is now active!');

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return;
    }

    const packageJsonPath = `${workspaceFolders[0].uri.fsPath}/package.json`;
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    const commands = packageJson.scripts;
	console.debug(commands);

    const buttons: StatusBarItem[] = [];

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('buttonzi.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from buttonzi!');
	});

	for (const command in commands) {
        const button = window.createStatusBarItem(StatusBarAlignment.Right);
        button.text = command;
        button.tooltip = `Run ${command}`;
        button.command = {
            command: 'buttonzi.runCommand',
            title: command,
            arguments: [command]
        };
        buttons.push(button);
    }

	buttons.forEach(button => {
        button.show();
    });

	let disposable2 = vscode.commands.registerCommand('buttonzi.runCommand', (command: string) => {
        const activeTerminal = vscode.window.activeTerminal;
        if (!activeTerminal) {
            vscode.window.showErrorMessage('No active terminal found.');
            return;
        }

        // Clear the terminal before executing the command
        activeTerminal.sendText('clear');

        // Execute the command in the terminal
        activeTerminal.sendText(commands[command]);
    });


	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}

// This method is called when your extension is deactivated
export function deactivate() {}
