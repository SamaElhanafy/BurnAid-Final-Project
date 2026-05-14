import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { readUsers, updateUser } from '../storage/usersStore';

dotenv.config();

const [, , emailArg, passwordArg] = process.argv;

if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEV_PASSWORD_RESET !== 'true') {
  throw new Error('Refusing to reset passwords in production without ALLOW_DEV_PASSWORD_RESET=true');
}

if (!emailArg || !passwordArg) {
  throw new Error('Usage: npm run dev:reset-password -- user@example.com newPassword123');
}

if (passwordArg.length < 6) {
  throw new Error('New password must be at least 6 characters');
}

const users = await readUsers();
const user = users.find((item) => item.email.toLowerCase() === emailArg.toLowerCase());

if (!user) {
  throw new Error(`No user found for ${emailArg}`);
}

user.passwordHash = await bcrypt.hash(passwordArg, 10);
await updateUser(user);

const savedUser = (await readUsers()).find((item) => item.id === user.id);
const verified = savedUser ? await bcrypt.compare(passwordArg, savedUser.passwordHash) : false;

if (!verified) {
  throw new Error('Password reset verification failed');
}

console.log(`Password reset successfully for ${user.email}`);
