import { betterAuth } from 'better-auth';
import { APIError } from 'better-auth/api';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { jwt } from 'better-auth/plugins';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set.');
}

if (!dbName) {
  throw new Error('DB_NAME environment variable is not set.');
}

const client = new MongoClient(uri);
const db = client.db(dbName);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  user: {
    modelName: 'users',
    additionalFields: {
      role: {
        type: ['student', 'tutor', 'admin'],
        required: false,
        defaultValue: 'student',
      },
      phone: {
        type: 'string',
        required: false,
      },
      bio: {
        type: 'string',
        required: false,
      },
      plan: {
        type: 'string',
        required: false,
        defaultValue: 'free',
        input: false,
      },
    },
  },

  // Validate role assignment on the server.
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const allowedRoles = ['student', 'tutor'];

          if (!allowedRoles.includes(user.role || 'student')) {
            throw new APIError('BAD_REQUEST', {
              message: 'Invalid registration role.',
            });
          }

          return {
            data: user,
          };
        },
      },

      update: {
        before: async (data) => {
          if (data.role !== undefined) {
            throw new APIError('BAD_REQUEST', {
              message: 'Changing your account role is not allowed.',
            });
          }

          return {
            data,
          };
        },
      },
    },
  },

  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: user.role,
        }),
      },
    }),
  ],
});
