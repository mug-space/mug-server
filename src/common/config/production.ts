export default () => {
	return {
		NODE_ENV: 'production',
		DATABASE_LOGGING: true,
		DATABASE_SCHEMA: 'mugspace',
		CLIENT_HOST: 'mug-space.io',
		CLIENT_URL: 'https://mug-space.io',
		SERVER_URL: 'https://api.mug-space.io',
		S3_BUCKET: 'mugspace-image',
		RDS_HOST: 'mugspace-db.c1qo4cyyqpm3.ap-northeast-2.rds.amazonaws.com',
		RDS_USERNAME: 'admin',
		RDS_PASSWORD: 'mugspace1234!',
		SOLAPI_API_KEY: 'NCSFMDBVJYOALRUK',
		SOLAPI_SECRET_KEY: 'ABS1PQR1MBISNWMQ0WJITB9WASSURHMP',
	}
}
