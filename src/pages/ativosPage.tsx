import Footer from "../components/footer.component";
import Navbar from "../components/navbar.component";

export default function AtivosPage() {
  return (
    <div>
      <Navbar local="ativos" />
      <div>
        <h1>Ativos</h1>
        <p>Esta é a página de ativos</p>
      </div>
      <Footer />
    </div>
  );
}