import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Usuário deve ter no mínimo 3 caracteres')
    .max(20, 'Usuário deve ter no máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Usuário só pode conter letras, números e underscore'),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
  playerName: z.string()
    .min(3, 'Nome do jogador deve ter no mínimo 3 caracteres')
    .max(30, 'Nome do jogador deve ter no máximo 30 caracteres'),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
