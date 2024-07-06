import crypto, { BinaryLike, BinaryToTextEncoding, KeyObject } from 'crypto'

export function sha256Hash(input: string, outputFormat: BinaryToTextEncoding = 'base64') {
	return crypto.createHash('sha256')
		.update(input)
		.digest(outputFormat)
}

export function sha1(input: string) {
	return crypto.createHash('sha1')
		.update(input).digest('hex')
}

export function sha1Hmac(input: string, key: BinaryLike | KeyObject, outputFormat: BinaryToTextEncoding = 'base64') {
	return crypto.createHmac('sha1', key)
		.update(input)
		.digest(outputFormat)
}

export function genToken() {
	return crypto.randomBytes(20).toString('hex')
}
