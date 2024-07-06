import { SecretManager } from '../utils/secret_manager'

export default async () => {
	let env
	try {
		const sm = new SecretManager()
		env = await sm.getEnv()
	} catch (e) {
		console.error(e)
		return {}
	}

	return env
}
