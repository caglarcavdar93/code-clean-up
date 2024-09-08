// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("extension.codeCleanUp", () => {
      // Get the active text editor
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      // Get the configuration for the extension
      const config = vscode.workspace.getConfiguration("codeCleanUp");
      const wordsToRemove = config.get("wordsToRemove");

      // Get the document and its text
      const document = editor.document;
      const text = document.getText();

      // Split the text into lines
      const lines = text.split(/\r?\n/g);

      // Iterate through each line, checking if it contains any of the words to remove
      const filteredLines = lines.filter((line) => {
        return !wordsToRemove.some((word) => line.includes(word));
      });

      if (filteredLines.length === lines.length) {
        return;
      }
      // Join the filtered lines back into a single string
      const newText = filteredLines.join("\n");

      // Replace the text in the document with the filtered text
      editor.edit((editBuilder) => {
        editBuilder.replace(
          document.validateRange(new vscode.Range(0, 0, document.lineCount, 0)),
          newText
        );
      });
    })
  );

  // Add the context menu option
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      [
        { language: "javascript", scheme: "file" },
        { language: "javascriptreact", scheme: "file" },
        { language: "typescript", scheme: "file" },
        { language: "typescriptreact", scheme: "file" },
        { language: "vue", scheme: "file" },
      ],
      {
        provideCodeActions: (document, range) => {
          return [
            {
              command: "extension.codeCleanUp",
              title: "Code Clean Up",
              arguments: [document, range],
            },
          ];
        },
      }
    )
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
