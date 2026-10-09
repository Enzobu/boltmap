---
name: rules
description: Load and apply all project engineering rules for the current task.
---


Load the complete project rule set before continuing.

## Workflow

1. Read the closest root and nested instruction files.
2. Read every Markdown file in `.agents/rules/` in alphabetical order.
3. Apply the most specific rule when broad and local guidance differ.
4. Briefly list the loaded rule titles without copying their full contents.
5. Continue the current task using those rules.
