# Development Scripts

This directory contains utility scripts for development and testing of oh-my-logo.

## Available Scripts

### test-filled-mode.sh

**Purpose**: Stress test for the `--filled` mode terminal cleanup functionality.

**Context**: This script was created to address [Issue #16](https://github.com/shinshin86/oh-my-logo/issues/16) - Terminal corruption after extensive use of `--filled` mode.

**Usage**:
```bash
./scripts/test-filled-mode.sh
```

**What it does**:
- Builds the project
- Runs 55 consecutive renders (5 iterations × 11 fonts)
- Tests all available block fonts with random color palettes
- Displays verification text to check for terminal corruption
- Helps ensure that ANSI escape sequences are properly reset

**When to use**:
- After modifying the Ink renderer (`src/InkRenderer.tsx`)
- When testing terminal compatibility with different environments
- To verify that terminal state cleanup is working correctly
- Before releasing changes that affect the `--filled` mode

**Expected output**:
After all iterations complete, the verification text (ASCII, Unicode, Japanese, box drawing characters) should display correctly without any corruption or artifacts.

## Adding New Scripts

When adding new development scripts:
1. Place them in this `scripts/` directory
2. Make them executable: `chmod +x scripts/your-script.sh`
3. Document them in this README with:
   - Purpose
   - Usage instructions
   - When to use
   - Expected behavior