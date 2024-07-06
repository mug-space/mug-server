export default () => {
	return {
		NODE_ENV: 'production',
		DATABASE_LOGGING: false,
		DATABASE_SCHEMA: 'mugspace',
		CLIENT_HOST: 'mug-space.io',
		CLIENT_URL: 'https://mug-space.io',
		SERVER_URL: 'https://mug-space.io',
		S3_BUCKET: 'mugspace-image',
	}
}
