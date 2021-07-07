Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)]
}

Array.prototype.partly = function (search, { depth } = {}) {
	if (!Array.isArray(search)) throw TypeError('search must be a array')
	return depth ? this.filter((arr) => search.every((value) => arr.includes(value))) : search.every((value) => this.includes(value))
}

Array.prototype.shuffle = function () {
	return this.sort(() => Math.random() - 0.5)
}

Array.prototype.partition = function (funct) {
	if (typeof funct != 'function') throw new Error('funct is not a function')

	const [a, b] = [[], []]
	for (let i = 0; i < this.length; i++) funct(this[i], i, this) ? a.push(this[i]) : b.push(this[i])
	return [a, b]
}

Array.prototype.table = function ({ align = 'left' } = {}) {
	const colWidths = this.map((col) => Math.max(...col.map((line) => (line ? line.length : 0)))),
		globalWidth = colWidths.reduce((acc, val) => acc + val) + colWidths.length * 3 - 1,
		horizontalBorder = '═'.repeat(globalWidth),
		horizontalSep = '\n║' + colWidths.map((n) => '─'.repeat(n + 2)).join('┼') + '║\n'
	return (
		'╔' +
		horizontalBorder +
		'╗\n' +
		[...this]
			.sort((a, b) => b.length - a.length)[0]
			.map((_, i) => '║ ' + this.map((col, j) => (align == 'center' ? (col[i] ? col[i].toString() : '').padStart((colWidths[j] + (col[i] ? col[i].length : colWidths[j])) / 2, ' ').padEnd(colWidths[j], ' ') : (col[i] ? col[i].toString() : '')[align == 'left' ? 'padEnd' : 'padStart'](colWidths[j], ' '))).join(' │ ') + ' ║')
			.join(horizontalSep) +
		'\n╚' +
		horizontalBorder +
		'╝'
	)
}

const createToble = (cols, { align = 'left' } = {}) => {}
