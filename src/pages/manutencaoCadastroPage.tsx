import Footer from "../components/footer.component";
import ManutencaoCadastroPage from "../components/manutencaoCadastroPage.component";
import Navbar from "../components/navbar.component";

export default function RouteManutecaoCadastro() {
  return (
    <div>
      <Navbar local="manutencaoCadastro" />
      <ManutencaoCadastroPage />
      <Footer />
    </div>
  );
}