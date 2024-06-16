import { Header } from './components/Header'
import { Main } from './components/Main'

export default function App() {
  return (
    <>
      <Header>
        <h1>Projeto base com React 18</h1>
      </Header>

      <Main>
        <ul>
          <li>O conteúdo fica aqui.</li>
        </ul>
      </Main>
    </>
  )
}
