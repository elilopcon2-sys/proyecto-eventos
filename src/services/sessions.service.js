import { getUserByEmail, saveUser } from "../repositories/users.repository.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createClientError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateRegistration = (
  { first_name, last_name, email, password } = {}
) => {
  if (!first_name || !last_name || !email || !password) {
    throw createClientError("Faltan campos obligatorios", 400);
  }

  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    throw createClientError("El formato del email es inválido", 400);
  }

  if (typeof password !== "string" || password.length < 8) {
    throw createClientError(
      "La contraseña debe tener al menos 8 caracteres",
      400
    );
  }
};
// Registro de usuario//

export const registerUser = async (registrationData) => {
  validateRegistration(registrationData);

  const { first_name, last_name, email, password } = registrationData;
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await getUserByEmail(normalizedEmail);

  if (existingUser) {
    throw createClientError("El email ya está registrado", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await saveUser({
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "user"
  });

  return {
    id: user._id.toString(),
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role
  };
};
// Login de usuario//
export const loginUser = async ({ email, password } = {}) => {
  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    throw createClientError("Credenciales inválidas", 401);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await getUserByEmail(normalizedEmail);

  if (!user) {
    throw createClientError("Credenciales inválidas", 401);
  }

  const isValidPassword = await comparePassword(
    password,
    user.password
  );

  if (!isValidPassword) {
    throw createClientError("Credenciales inválidas", 401);
  }

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role
  };
};