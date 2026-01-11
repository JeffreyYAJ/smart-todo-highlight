
import * as vscode from 'vscode';

interface TodoItem{
	text:string;
	line : number;
	priority: number;
	type: 'TODO'|"FIXME";
	timestamp?:Date;

}

const decaroationTypes = {
	high: vscode.window.createTextEditorDecorationType({
		backgroundColor: 'rgba(255, 0, 0, 0.28)',
		border: '1px solid red',
		overviewRulerColor:'red',
		overviewRulerLane: vscode.OverviewRulerLane.Right,
	}),
	medium: vscode.window.createTextEditorDecorationType({
		backgroundColor: 'rgba(255, 128, 0, 0.27)',
		border: '1px solid orange',
		overviewRulerColor:'orange',
		overviewRulerLane: vscode.OverviewRulerLane.Right,
	}),
	low: vscode.window.createTextEditorDecorationType({
		backgroundColor: 'rgba(255,255,0,0.3)',
		border: '1px solid yellow',
		overviewRulerColor: 'yellow',
		overviewRulerLane: vscode.OverviewRulerLane.Right,
	})
}

export function activate(context: vscode.ExtensionContext) {
	
	console.log('extension "smartTodoHighlight" active!');

	let activeEditor = vscode.window.activeTextEditor;
	let todoProvider = new TodoTreeDataProvider();

	vscode.window.registerTreeDataProvider('todoList', todoProvider);

	let refreshCommand = vscode.commands.registerCommand('todoHighlighter.refresh', ()=>{
		updateDecorations();
		todoProvider.refresh();
	});

	let gotoCommand = vscode.commands.registerCommand('todoHighlighter.goto', (line:number)=>{
		if (activeEditor){
			const position = new vscode.Position(line,0);
			activeEditor.selection = new vscode.Selection(position, position);
			activeEditor.revealRange(new vscode.Range(position, position));
		}
	});

	context.subscriptions.push(refreshCommand, gotoCommand);

	if (activeEditor){
		updateDecorations();

	}

	vscode.window.onDidChangeActiveTextEditor(editor =>{
		activeEditor = editor;
		if (editor){
			updateDecorations();
			todoProvider.refresh();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			updateDecorations();
			todoProvider.refresh();
		}
	}, null, context.subscriptions);

	function updateDecorations(){
		if (!activeEditor){
			return ;
		}

		const text = activeEditor.document.getText();
		const todos = parseTodos(text);

		const highPriority: vscode.DecorationOptions[] = [];
		const mediumPriority: vscode.DecorationOptions[] = [];
		const lowPOriority: vscode.DecorationOptions[] = [];

		todos.forEach(todo => {
			const startPosition = activeEditor!.document.positionAt(
				text.split('\n').slice(0, todo.line).join('\n').length +(todo.line > 0? 1:0)
			);
			const endPosition = activeEditor!.document.positionAt(
				text.split('\n').slice(0, todo.line + 1).join('\n').length
			);

			const decoration: vscode.DecorationOptions = {
				range: new vscode.Range(startPosition, endPosition),
				hoverMessage: `${todo.type} - Priority: ${todo.priority}`
			};

			if (todo.priority >= 3 || todo.type === 'FIXME'){
				highPriority.push(decoration);

			}else if (todo.priority  === 2) {
				mediumPriority.push(decoration);
			}else {
				lowPOriority.push(decoration);
			}
		});

		activeEditor.setDecorations(decaroationTypes.high, highPriority);
		activeEditor.setDecorations(decaroationTypes.medium, mediumPriority);
		activeEditor.setDecorations(decaroationTypes.low, lowPOriority);
	}
}

function parseTodos(text:string): TodoItem[] {
	const lines = text.split('\n');
	const todos: TodoItem[] = [];

	lines.forEach((line, index) => {
		const todoRegex = /\/\/\s*(TODO|FIXME)(?:\[(P[1-3])\])?:?\s*(.+)/g;
		let foundSequence; 
		while ((foundSequence = todoRegex.exec(line)) !== null) {
			const type = foundSequence[1].toUpperCase() as 'TODO' | 'FIXME';
			const priority = foundSequence[2]
  ? parseInt(foundSequence[2][1])
  : (type === "FIXME" ? 3 : 1);

			const text = foundSequence[3] || "";
			
			todos.push({
				text, line:index, priority, type
			});
		}
	});

	return todos.sort((todoa, todob) =>{
		if (todob.priority !== todoa.priority){
			return todob.priority - todoa.priority;
		}
		return todoa.line - todob.line;
	});
}

class TodoTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly line: number,
        private priority: number
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.command = {
            command: 'todoHighlighter.goto',
            title: 'Aller à',
            arguments: [line]
        };
        this.iconPath = new vscode.ThemeIcon(
            priority >= 3 ? 'error' : priority === 2 ? 'warning' : 'info'
        );
    }
}

class TodoTreeDataProvider implements vscode.TreeDataProvider<TodoTreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<TodoTreeItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: TodoTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TodoTreeItem): Thenable<TodoTreeItem[]> {
        if (!vscode.window.activeTextEditor) {
            return Promise.resolve([]);
        }

        const text = vscode.window.activeTextEditor.document.getText();
        const todos = parseTodos(text);

        return Promise.resolve(
            todos.map(todo => new TodoTreeItem(
                `[P${todo.priority}] ${todo.type}: ${todo.text}`,
                todo.line,
                todo.priority
            ))
        );
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
