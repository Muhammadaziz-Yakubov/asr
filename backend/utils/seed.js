import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export async function seedUser() {
  try {
    const username = 'samandar';
    const rawPassword = '2026@Samandar';

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`[Seed] '${username}' foydalanuvchisi bazada allaqachon mavjud.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    console.log(`[Seed] '${username}' foydalanuvchisi muvaffaqiyatli yaratildi.`);
  } catch (error) {
    console.error('[Seed] Xatolik yuz berdi:', error);
  }
}
