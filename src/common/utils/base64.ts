export function decode(text: string) {
	return JSON.parse(Buffer.from(text, 'base64').toString('utf8'))
}

export function encode(data: any) {
	return Buffer.from(JSON.stringify(data), 'utf8').toString('base64')

}
