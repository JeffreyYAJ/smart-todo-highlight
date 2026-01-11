# Smart Todo Highlight

A VS Code extension that highlights TODO and FIXME comments in your code with priority-based color coding and provides a convenient tree view for navigation.

## Features

- **Priority-Based Highlighting**: Automatically highlights TODO comments with color-coded priorities (p1, p2, p3)
  - **P3 (High)**: Red background with red border
  - **P2 (Medium)**: Orange background with orange border
  - **P1 (Low)**: Yellow background with yellow border
  - **FIXME**: Blue background with blue border

- **Tree View (for future versions)**: Displays all TODOs and FIXMEs in the Explorer sidebar for quick navigation
- **Overview Ruler**: Shows todo locations in the scrollbar for easy scanning
- **Quick Navigation**: Click any todo in the tree view to jump to its location
- **Real-Time Updates**: Automatically updates when you switch files or edit code

## Usage

### Comment Syntax

Use the following formats in your code comments:

```javascript
// TODO(p3): High priority task
// TODO(p2): Medium priority task
// TODO(p1): Low priority task
// FIXME: fixes
```

### Commands

- **Refresh TODO Highlight**: Manually refresh the todo list and decorations
- **Go to TODO**: Navigate to a specific todo (automatically triggered when clicking in the tree view)

### Tree View (For future versions)

Open the **Smart TODOs** view in the Explorer sidebar to see all todos in the current file, organized by priority.

## Configuration

The extension works with default settings and requires no additional configuration.

## Requirements

- VS Code ^1.106.3

## Installation

1. Clone or download this repository
2. Run `npm install`
3. Press `F5` to launch the extension in development mode

## Development

### Scripts

- `npm run compile`: Compile TypeScript to JavaScript
- `npm run watch`: Watch for changes and recompile automatically
- `npm run lint`: Run ESLint to check code style
- `npm test`: Run the test suite

## License

See CHANGELOG.md for version history and changes.