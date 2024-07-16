import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { join } from 'path'

@Injectable()
export default class TypeOrmConfig implements TypeOrmOptionsFactory {
	@Inject()
	private readonly configService: ConfigService

	async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
		const dbInfo = await this.getDbInfo()
		return {
			replication: dbInfo,
			logging: this.configService.get('DATABASE_LOGGING') === true,
			timezone: 'Z',
			port: 3306,
			type: 'mysql',
			charset: 'utf8mb4_unicode_ci',
			dateStrings: [ 'DATE' ],
			entities: [ join(__dirname, '/../../api/entities/*.entity{.ts,.js}') ],
			synchronize: false,
			bigNumberStrings: false,
			maxQueryExecutionTime: 5000,
			extra: {
				connectionLimit: Number(this.configService.get('DATABASE_POOL_SIZE', 2)),
				decimalNumbers: true,
			},
		}
	}

	async getDbInfo() {
		return {
			master: {
				host: this.configService.get('RDS_HOST'),
				port: 3306,
				username: this.configService.get('RDS_USERNAME'),
				password: this.configService.get('RDS_PASSWORD'),
				database: this.configService.get('DATABASE_SCHEMA'),
			},
			slaves: [{
				host: this.configService.get('RDS_HOST'),
				port: 3306,
				username: this.configService.get('RDS_USERNAME'),
				password: this.configService.get('RDS_PASSWORD'),
				database: this.configService.get('DATABASE_SCHEMA'),
			}],
		}
	}
}
