import * as vscode from 'vscode';
import * as fs from 'fs';
import { StatusBarAlignment, StatusBarItem, window } from 'vscode';
export function activate(context: vscode.ExtensionContext) {

    console.log('"buttonzi" is now active!');

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return;
    }

    const packageJsonPath = `${workspaceFolders[0].uri.fsPath}/package.json`;
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    const commands = packageJson.scripts;

    const buttons: StatusBarItem[] = [];

    let disposable = vscode.commands.registerCommand('buttonzi.runButtonZi', () => {
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

        activeTerminal.sendText('clear');

        activeTerminal.sendText(`npm run ${command}`);
    });


    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
}


export function deactivate() { }
