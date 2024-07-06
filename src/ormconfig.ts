
import { DataSource } from 'typeorm'
import configuration from './common/config/configuration'

/**
 *
 * @returns for orm migration config
 */
export const ormconfig = async () => {
	const env = await configuration()
	return new DataSource({
		type: 'mysql',
		host: env['RDS_HOST'],
		port: 3306,
		username: env['RDS_USERNAME'],
		password: env['RDS_PASSWORD'],
		database: 'mugspace',
		charset: 'utf8mb4_unicode_ci',
		dateStrings: [ 'DATE' ],
		synchronize: false,
		logging: true,
		entities: [ './src/api/entities/*.entity.ts' ],
		migrations: [ './src/migrations/*.ts' ],
		migrationsTableName: 'migrations', // migration 내용이 기록될 테이블명(default = migration)
	})
}

export default ormconfig()
