import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    return null;
  }
};

export const verifyPassword = async ({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}) => {
  try {
    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
    return isPasswordCorrect;
  } catch (error) {
    return null;
  }
};
