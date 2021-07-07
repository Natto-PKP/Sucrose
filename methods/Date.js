const times = [['année', 315576e5], ['mois', 2592e6], ['jour', 864e5], ['heure', 36e5], ['minute', 6e4], ['seconde', 1e3], ['milliseconde', 1]]
Date.prototype.duration = function () {
	const date = Date.now() - this.getTime()
	const [text, ms] = times.find((time) => date > time[1])
	return '**' + Math.ceil(date / ms) + '** ' + (Math.ceil(date / ms) > 1.5 ? (text.endsWith('s') ? text : text + 's') : text)
}

Date.prototype.rest = function () {
	return (23 - this.getHours()) * 36e5 + (59 - this.getMinutes()) * 6e4 + (59 - this.getSeconds()) * 1e3 + this.getMilliseconds()
}

const months = { full: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'], half: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Nov', 'Déc'] }
const days = { full: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'], half: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] }
Date.prototype.format = function (form) {
	if (typeof form != 'string') throw new Error('form must be a string')

	const marks = {
		YYYY: this.getFullYear().toString(),
		YY: this.getUTCFullYear().toString().slice(2),

		MMMM: months.full[this.getMonth()],
		MMM: months.half[this.getMonth()],
		MM: this.getMonth().toString().padStart(2, '0'),
		M: this.getMonth().toString(),

		DDDD: days.full[this.getDay()],
		DDD: days.half[this.getDay()],
		DD: this.getDate().toString().padStart(2, '0'),
		D: this.getDate().toString(),
		d: this.getDay().toString(),

		hh: this.getHours().toString().padStart(2, '0'),
		h: this.getHours().toString(),

		mm: this.getMinutes().toString().padStart(2, '0'),
		m: this.getMinutes().toString(),

		ss: this.getSeconds().toString().padStart(2, '0'),
		s: this.getSeconds().toString(),

		ms: this.getMilliseconds().toString()
	}

	return form.replace(/YYYY|YY|MMMM|MMM|MM|M|DDDD|DDD|DD|D|d|hh|h|mm|m|ss|s|ms/g, (str) => marks[str])
}
