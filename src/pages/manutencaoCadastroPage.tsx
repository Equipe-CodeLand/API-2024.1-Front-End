import Footer from "../components/footer";
import ManutencaoCadastroPage from "../components/manutencaoCadastroPage.component";
import Navbar from "../components/navbar";

export default function RouteManutecaoCadastro() {
  return (
    <div>
      <Navbar local="manutencaoCadastro" />
      <ManutencaoCadastroPage />
      <Footer />
    </div>
  );
}