import './globals.css'
export const metadata = {
  title: 'Clínica Ghisolfi',
  description: 'Sistema de Gestão - Estética & Odontologia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
