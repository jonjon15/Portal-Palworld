"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Login - Portal Palworld',
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Usuário e senha são obrigatórios.");
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salva autenticação no localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("palworld_auth", "true");
          localStorage.setItem("userId", data.userId);
        }
        router.push("/");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Erro ao fazer login.");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, margin: "60px auto" }}>
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuário</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Entrar</button>
      </form>
      <div className="mt-3 text-center">
        <Link href="/register">Não tem conta? Cadastre-se</Link>
      </div>
    </div>
  );
}