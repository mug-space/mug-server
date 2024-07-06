export default () => {
	return {
		NODE_ENV: 'local',
		DATABASE_LOGGING: true,
		DATABASE_SCHEMA: 'mugspace',
		CLIENT_HOST: 'localhost',
		CLIENT_URL: 'http://localhost:3000',
		SERVER_URL: 'http://localhost:8000',
		S3_BUCKET: 'mugspace-image',
		RDS_HOST: '',
		RDS_USERNAME: '',
		RDS_PASSWORD: '',
	}
}
