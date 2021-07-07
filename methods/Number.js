const array = ['y', 'z', 'e', 'p', 't', 'g', 'm', 'k']
/**
 * @returns { string }
 */
Number.prototype.form = function () {
	let [value, y] = [this, 0]
	for (let i = 24; i > 0; i = i - 3) {
		if (value >= 10 ** i) return ((value / 10 ** i).toFixed(1).toString().includes('.0') ? (value / 10 ** i).toFixed(0) : (value / 10 ** i).toFixed(1)) + array[y]
		else y++
	}

	return value.toString()
}
