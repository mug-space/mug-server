export default () => {
	return {
		NODE_ENV: 'development',
		DATABASE_LOGGING: false,
		DATABASE_SCHEMA: 'mugspace',
		CLIENT_HOST: 'mug-space.io',
		CLIENT_URL: 'https://mug-space.io',
		SERVER_URL: 'https://api.mug-space.io',
		S3_BUCKET: 'mugspace-image',
		RDS_HOST: 'mugspace-db.c1qo4cyyqpm3.ap-northeast-2.rds.amazonaws.com',
		RDS_USERNAME: 'admin',
		RDS_PASSWORD: 'mugspace1234!',
	}
}
