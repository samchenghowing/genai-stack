/**
 * Extracts task information from a given input string.
 *
 * @param {string} input - The input string containing task information.
 * @return {Array<string>} An array containing the JavaScript, HTML and CSS code of the task.
 */
export function extract_task(input: string) {
    // Extract JavaScript code using regular expressions
    const jsCodeRegex = /```javascript\n([\s\S]*?)\n```/g;
    const jsCodeMatches = [...input.matchAll(jsCodeRegex)];
    const jsCode = jsCodeMatches.map(match => match[1]).join('\n');

    // Extract HTML code using regular expressions
    const htmlCodeRegex = /```html\n([\s\S]*?)\n```/g;
    const htmlCodeMatches = [...input.matchAll(htmlCodeRegex)];
    const htmlCode = htmlCodeMatches.map(match => match[1]).join('\n');

    // Extract CSS code using regular expressions
    const cssCodeRegex = /```css\n([\s\S]*?)\n```/g;
    const cssCodeMatches = [...input.matchAll(cssCodeRegex)];
    const cssCode = cssCodeMatches.map(match => match[1]).join('\n');

    return [jsCode, htmlCode, cssCode];
}
