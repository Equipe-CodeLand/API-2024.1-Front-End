import Footer from "../components/footer";
import Navbar from "../components/navbar";

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