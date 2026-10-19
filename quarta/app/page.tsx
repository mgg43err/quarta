import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import Subscription from "@/components/Subscription";
import Delivery from "@/components/Delivery";
import Contacts from "@/components/Contacts";
import OrderSection from "@/components/OrderSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Products />
        <Subscription />
        <Delivery />
        <Contacts />
        <OrderSection />
      </main>
      <Footer />
    </>
  );
}
