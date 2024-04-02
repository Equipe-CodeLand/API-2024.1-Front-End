import Footer from "../components/footer.component";
import ManutencaoPage from "../components/manutencaoPage.component";
import Navbar from "../components/navbar.component";

export default function RouteManutecao() {
  return (
    <div>
      <Navbar local="manutencao" />
      <ManutencaoPage />
      <Footer />
    </div>
  );
}
