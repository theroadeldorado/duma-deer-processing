# Code Review: Changes Since Last Push

Review all code changes in the current branch since the last git push.

## Steps

1. **Identify the comparison point**: Run `git rev-parse @{push}` to find the last pushed commit. If this fails (branch hasn't been pushed yet), compare against the main branch using `git merge-base HEAD main`.

2. **Get the diff**: Run `git diff <base-commit>..HEAD` to see all changes.

3. **List changed files**: Run `git diff --name-only <base-commit>..HEAD` to get a list of modified files.

4. **Review the changes** looking for:
   - **Bugs & Logic Errors**: Off-by-one errors, null/undefined handling, race conditions, incorrect conditionals
   - **Security Issues**: SQL/command injection, XSS vulnerabilities, exposed secrets, improper auth checks
   - **Performance**: N+1 queries, unnecessary re-renders, missing memoization, inefficient algorithms
   - **Code Quality**: Dead code, code duplication, unclear naming, missing error handling
   - **Type Safety**: Any types, missing null checks, incorrect type assertions
   - **Best Practices**: Proper async/await usage, resource cleanup, consistent patterns with existing code

5. **Provide a structured review** with:
   - Summary of changes (what the diff accomplishes)
   - Issues found (grouped by severity: critical, warning, suggestion)
   - Specific file:line references for each issue
   - Suggested fixes with code snippets where helpful

## Output Format

```
## Summary
[Brief description of what these changes do]

## Files Changed
- file1.ts (added/modified/deleted)
- file2.ts (added/modified/deleted)

## Issues Found

### Critical
- **[file:line]** Description of critical issue
  ```suggestion
  // suggested fix
  ```

### Warnings
- **[file:line]** Description of warning

### Suggestions
- **[file:line]** Description of suggestion

## Overall Assessment
[Ship it / Needs changes / Needs discussion]
```

## UI/UX Review

6. **UI/UX Quality Review**: After completing the code review above, check if any of the changed files are React components (`.tsx` files in `components/`, `pages/`, or similar). If UI components were modified:

   - Use the `ui-ux-qa-engineer` agent to perform a comprehensive UI/UX review of the changed components
   - The agent should evaluate: visual design quality, usability, accessibility (WCAG 2.2 AA), and interaction quality
   - If the dev server is running at localhost:3000, use Playwright MCP for evidence-driven testing
   - Include the agent's ship/no-ship recommendation in the final assessment

   Pass the agent the list of changed component files and ask it to review them for:
   - Visual design (layout, spacing, typography, consistency)
   - Usability (affordances, feedback, error states, responsiveness)
   - Accessibility (keyboard navigation, focus states, ARIA, contrast)
   - Interaction quality (hover/focus/active states, transitions)
