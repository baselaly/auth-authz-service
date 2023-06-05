import { PrismaClient } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // START CREATE : Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'super-admin' },
    create: {
      name: 'super-admin',
      rolePermissions: {
        create: [
          {
            permission: {
              create: {
                name: 'create-super-visor',
              },
            },
          },
          {
            permission: {
              create: {
                name: 'update-super-visor',
              },
            },
          },
          {
            permission: {
              create: {
                name: 'list-super-visor',
              },
            },
          },
        ],
      },
    },
    update: {
      name: 'super-admin',
    },
  });

  const superVisorRole = await prisma.role.upsert({
    where: {
      name: 'super-visor',
    },
    create: {
      name: 'super-visor',
      rolePermissions: {
        create: [
          {
            permission: {
              create: {
                name: 'create-employee',
              },
            },
          },
          {
            permission: {
              create: {
                name: 'update-employee',
              },
            },
          },
          {
            permission: {
              create: {
                name: 'list-employee',
              },
            },
          },
        ],
      },
    },
    update: {
      name: 'super-visor',
    },
  });

  // END CREATE : ROLES

  // START CREATE : USERS
  const plainPassword = '123456';
  const saltRounds = Number(process.env.SALT_ROUNDS);

  const adminSalt = genSaltSync(saltRounds);
  const superVisorSalt = genSaltSync(saltRounds);

  const adminPassword = hashSync(plainPassword, adminSalt);
  const superVisorPassword = hashSync(plainPassword, superVisorSalt);

  await prisma.user.upsert({
    where: { email: 'super-admin@test.com' },
    create: {
      name: 'super-admin',
      email: 'super-admin@test.com',
      password: adminPassword,
      salt: adminSalt,
      userRoles: {
        create: [{ roleId: superAdminRole.id }],
      },
    },
    update: {
      name: 'super-admin',
    },
  });

  await prisma.user.upsert({
    where: { email: 'super-visor@test.com' },
    create: {
      name: 'super-visor',
      email: 'super-visor@test.com',
      password: superVisorPassword,
      salt: superVisorSalt,
      userRoles: {
        create: [{ roleId: superVisorRole.id }],
      },
    },
    update: {
      name: 'super-visor',
    },
  });
  // END CREATE : USERS
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
