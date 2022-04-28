module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'postgres',
  entities: ['dist/**/*.entity.js'], // referenciando a dist por ser typescript
  migrations: ['dist/migrations/*.js'], // referenciando a dist por ser typescript
  cli: {
    migrationsDir: 'src/migrations', // aqui devemos referenciar o projeto ts msm
  },
};
