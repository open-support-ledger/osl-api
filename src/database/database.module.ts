import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        if (!url) {
          throw new Error(
            'DATABASE_URL is not set. Copy .env.example to .env and point it at your local Postgres.',
          );
        }
        return {
          type: 'postgres' as const,
          url,
          autoLoadEntities: true,
          // Never enable synchronize. Schema changes go through migrations.
          synchronize: false,
          migrationsRun: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
