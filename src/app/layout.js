import './globals.css'

export const metadata = {
  title: 'Valrisico Dashboard - Gemeente Oude IJsselstreek',
  description: 'Dashboard voor valrisico-analyse bij 65-plussers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
