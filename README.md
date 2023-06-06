# Fatura-Service-Task

Backend Authentication & Authorization Service Deliver Three APIS (Login - Logout - Check Action) Using Nestjs - postgresql

## Run The Project

Clone the project

```bash
  git clone https://github.com/baselaly/auth-authz-service.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Run Migrations

```bash
  npm run prisma:migrate-dev
```

Generate Prisma CLient

```bash
  npm run prisma:generate
```

Run Database Seeder

```bash
  npm run prisma:seed
```

Start the server

```bash
  npm run start:dev
```

## Testing

Run Unit Testing

```bash
  npm run test
```

## Features

- Login
- Logout
- Check User Action

## dummy data for test

- Super Admin (super-admin@test.com , 123456) -> role (super-admin) -> permissions (create-super-visor / update-super-visor / list-super-visor)
- Super Visor (super-visor@test.com , 123456) -> role (super0visor) -> permissions(create-employee / update-employee / list-employee)

## Authors

- Basel Aly (https://github.com/baselaly)
