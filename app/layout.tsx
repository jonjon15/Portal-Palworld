import "../public/lib/bootstrap/dist/css/bootstrap.min.css";
import React from "react";

export const metadata = {
  title: "Portal Palworld",
  description: "Gerencie jogadores, marketplace, mapa e servidores do Palworld!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-dark text-light">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Palworld Portal</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
                <li className="nav-item"><a className="nav-link" href="/player">Jogador</a></li>
                <li className="nav-item"><a className="nav-link" href="/marketplace">MarketPlace</a></li>
                <li className="nav-item"><a className="nav-link" href="/mapa">Mapa Interativo</a></li>
                <li className="nav-item"><a className="nav-link" href="/servidores">Meus Servidores</a></li>
              </ul>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link" href="/login">Entrar</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
