import Navbar from './components/Navbar'
import "./globals.css"

export const metadata = {
  title: 'OpenCourt',
  description: 'Find and join sports games in your area',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
