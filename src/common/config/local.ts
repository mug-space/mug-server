export default () => {
	return {
		NODE_ENV: 'local',
		DATABASE_LOGGING: true,
		DATABASE_SCHEMA: 'mugspace',
		CLIENT_HOST: 'localhost',
		CLIENT_URL: 'http://localhost:3000',
		SERVER_URL: 'http://localhost:8000',
		S3_BUCKET: 'mugspace-image',
		RDS_HOST: 'mugspace-db.c1qo4cyyqpm3.ap-northeast-2.rds.amazonaws.com',
		RDS_USERNAME: 'admin',
		RDS_PASSWORD: 'mugspace1234!',
	}
}
