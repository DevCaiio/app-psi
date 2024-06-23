import { SimpleFooter } from "./components/Footer";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { NavbarSimple } from "./components/Navbar";

export default function App() {
  return (
    <>
      <NavbarSimple></NavbarSimple>
      <Header>
        <h1>Projeto base com React 18</h1>
      </Header>

      <Main>
        <ul>
          <li>O conteúdo fica aqui.</li>
        </ul>
      </Main>
      <SimpleFooter></SimpleFooter>
    </>
  );
}
