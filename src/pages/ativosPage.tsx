import AtivosPage from "../components/ativosPage.component";
import Footer from "../components/footer.component";
import Navbar from "../components/navbar.component";

export default function RouteAtivos() {
  return (
    <div>
      <Navbar local="ativos" />
      <AtivosPage />
      <Footer />
    </div>
  );
}