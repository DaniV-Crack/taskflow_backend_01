import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { RegisterDto, LoginDto, AuthResponse, JwtPayload } from "../types/auth.types";

const SALT_ROUNDS = 10;

export const authService = {
  // Registra un nuevo usuario. Valida que el email no exista, hashea la contraseña y devuelve un token JWT.
  async register(data: RegisterDto): Promise<AuthResponse> {
    // 1. Verificar si el email ya está registrado
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw { status: 409, message: "El email ya está registrado" };

    // 2. Hashear la contraseña con bcrypt
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // 3. Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    
    // 4. Generar un token JWT para el nuevo usuario
    const token = generateToken({ userId: user.id, email: user.email });

    // 5. Retornar token + datos del usuario
    return { token, user };
  },
  
  // Autentica un usuario por email/contraseña. Devuelve token JWT si las credenciales son válidas.
  async login(data: LoginDto): Promise<AuthResponse> {
    // 1. Buscar usuario por email
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    // Mensaje genérico: no revelar si el email existe o no
    const INVALID = "Credenciales inválidas";

    // 2. Si el usuario no existe, lanzar error 401
    if (!user) throw { status: 401, message: INVALID };

    // 3. Comparar la contraseña recibida con el hash almacenado
    const match = await bcrypt.compare(data.password, user.passwordHash);

    // 4. Si la contraseña no coincide, lanzar error 401
    if (!match) throw { status: 401, message: INVALID };

    // 5. Generar token JWT
    const token = generateToken({ userId: user.id, email: user.email });
    
    // 6. Retornar token + datos públicos del usuario
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  },
};

// Genera un token JWT firmado con el secreto y expiración definidos en las variables de entorno
function generateToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET no está definido en las variables de entorno");
  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as jwt.SignOptions["expiresIn"],
  });
}
