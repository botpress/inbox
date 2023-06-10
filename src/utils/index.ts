export function getNumberEmoji(number: number) {
	if (number <= 10) {
		switch (number) {
			case 0:
				return '0️⃣';
			case 1:
				return '1️⃣';
			case 2:
				return '2️⃣';
			case 3:
				return '3️⃣';
			case 4:
				return '4️⃣';
			case 5:
				return '5️⃣';
			case 6:
				return '6️⃣';
			case 7:
				return '7️⃣';
			case 8:
				return '8️⃣';
			case 9:
				return '9️⃣';
			case 10:
				return '🔟';
			default:
				return '❓';
		}
	} else {
		let numberString = number.toString();
		let numberEmoji = '';
		for (let i = 0; i < numberString.length; i++) {
			switch (numberString[i]) {
				case '0':
					numberEmoji += '0️⃣';
					break;
				case '1':
					numberEmoji += '1️⃣';
					break;
				case '2':
					numberEmoji += '2️⃣';
					break;
				case '3':
					numberEmoji += '3️⃣';
					break;
				case '4':
					numberEmoji += '4️⃣';
					break;
				case '5':
					numberEmoji += '5️⃣';
					break;
				case '6':
					numberEmoji += '6️⃣';
					break;
				case '7':
					numberEmoji += '7️⃣';
					break;
				case '8':
					numberEmoji += '8️⃣';
					break;
				case '9':
					numberEmoji += '9️⃣';
					break;
				default:
					numberEmoji += '❓';
					break;
			}
		}
		return numberEmoji;
	}
}

export function getCountLabel(
	count: number,
	singular: string,
	plural: string,
	none: string,
	showCount?: boolean
) {
	return count === 0
		? none
		: `${showCount ? `${count} ` : ''}${count === 1 ? singular : plural}`;
}

export function isDefinedAndHasItems<T>(array: T[] | undefined): boolean {
	return array !== undefined && array.length > 0;
}

export function isNumberDefined(number: any): number is number {
	return number !== undefined && number !== null;
}

export function isBooleanDefined(bool: any): bool is boolean {
	return bool !== undefined && bool !== null;
}
