import Footer from "../components/footer.component";
import HomePage from "../components/homePage.component";
import Navbar from "../components/navbar.component";

export default function RouteHome() {
  return (
    <div>
      <Navbar local="home"/>
      <HomePage/>
      <Footer />
    </div>
  );
}