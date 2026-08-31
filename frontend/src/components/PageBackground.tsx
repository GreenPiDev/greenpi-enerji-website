import type { ReactNode } from 'react'
import bg from '../assets/page-background.jpg'

function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative">{children}</div>
    </div>
  )
}

export default PageBackground
