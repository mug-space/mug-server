export default () => {
	return {
		NODE_ENV: 'development',
		DATABASE_LOGGING: false,
		DATABASE_SCHEMA: 'mugspace',
		CLIENT_HOST: 'mug-space.io',
		CLIENT_URL: 'https://mug-space.io',
		SERVER_URL: 'http://localhost:8000',
		S3_BUCKET: 'mugspace-image',
	}
}
