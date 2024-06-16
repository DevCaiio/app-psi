import { cn } from '../utils/utils'

export function Header({ children = <h1>Conteúdo do Header</h1> }) {
  return (
    <div
      className={cn(
        'h-12 p-2 bg-gray-100 text-center text-xl font-semibold',
        'flex flex-row items-center justify-center'
      )}
    >
      {children}
    </div>
  )
}
