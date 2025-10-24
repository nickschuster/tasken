#!/usr/bin/env node

/**
 * Script to validate that all Svelte components use Svelte 5 runes syntax
 * and do not contain deprecated patterns.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Patterns to check for old syntax
const OLD_SYNTAX_PATTERNS = [
	{
		pattern: /export\s+let\s+\w+/g,
		message: 'Uses old "export let" syntax instead of $props() rune',
		suggestion: 'Replace with: let { propName }: Props = $props()'
	},
	{
		pattern: /\bon:(click|keydown|keyup|keypress|mousedown|mouseup|mousemove|mouseenter|mouseleave|focus|blur|change|input|submit)/g,
		message: 'Uses old event handler syntax (on:event)',
		suggestion: 'Replace with: onevent (e.g., onclick, onkeydown)'
	},
	{
		pattern: /\$:\s+(?!\s*(if|{))/g,
		message: 'Uses old reactive statement syntax ($:) instead of runes',
		suggestion: 'Replace with: $derived() for computed values, $effect() for side effects'
	}
];

// Exceptions - some patterns might be acceptable in specific contexts
const EXCEPTIONS = [
	'node_modules',
	'.git',
	'dist',
	'build',
	'.svelte-kit'
];

/**
 * Recursively find all .svelte files
 */
function findSvelteFiles(dir, fileList = []) {
	const files = readdirSync(dir);

	for (const file of files) {
		const filePath = join(dir, file);
		const stat = statSync(filePath);

		// Skip exceptions
		if (EXCEPTIONS.some(exc => filePath.includes(exc))) {
			continue;
		}

		if (stat.isDirectory()) {
			findSvelteFiles(filePath, fileList);
		} else if (file.endsWith('.svelte')) {
			fileList.push(filePath);
		}
	}

	return fileList;
}

/**
 * Check a file for old syntax patterns
 */
function checkFile(filePath) {
	const content = readFileSync(filePath, 'utf-8');
	const relativePath = relative(ROOT_DIR, filePath);
	const issues = [];

	for (const { pattern, message, suggestion } of OLD_SYNTAX_PATTERNS) {
		const matches = content.match(pattern);
		if (matches) {
			issues.push({
				file: relativePath,
				message,
				suggestion,
				occurrences: matches.length,
				examples: matches.slice(0, 3) // Show up to 3 examples
			});
		}
	}

	return issues;
}

/**
 * Main function
 */
function main() {
	console.log('🔍 Checking Svelte components for old syntax patterns...\n');

	const svelteFiles = findSvelteFiles(join(ROOT_DIR, 'src'));
	console.log(`Found ${svelteFiles.length} Svelte component(s)\n`);

	let totalIssues = 0;
	const filesWithIssues = [];

	for (const file of svelteFiles) {
		const issues = checkFile(file);
		if (issues.length > 0) {
			totalIssues += issues.length;
			filesWithIssues.push({ file: relative(ROOT_DIR, file), issues });
		}
	}

	if (totalIssues === 0) {
		console.log('✅ All components use Svelte 5 runes syntax!\n');
		process.exit(0);
	} else {
		console.log(`❌ Found ${totalIssues} issue(s) in ${filesWithIssues.length} file(s):\n`);
		
		for (const { file, issues } of filesWithIssues) {
			console.log(`\n📄 ${file}`);
			for (const issue of issues) {
				console.log(`   ⚠️  ${issue.message}`);
				console.log(`       Found ${issue.occurrences} occurrence(s)`);
				if (issue.examples.length > 0) {
					console.log(`       Examples: ${issue.examples.join(', ')}`);
				}
				console.log(`       💡 ${issue.suggestion}`);
			}
		}

		console.log('\n📚 For more information, see .github/SVELTE_RUNES_GUIDE.md\n');
		process.exit(1);
	}
}

main();
