import AtivosPageComponent from "../components/ativosPage.component";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function AtivosPage() {
  return (
    <div>
      <Navbar local="ativos" />
      <AtivosPageComponent />
      <Footer />
    </div>
  );
}