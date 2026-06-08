

import ExploreServices from "../components/LandingPage/exploreServices/ExploreServices";
import Hero from "../components/LandingPage/hero/Hero";
import Services from "../components/LandingPage/services/Services";
import TopFooter from "../components/LandingPage/footer/TopFooter";
import Navbar from "../components/General/navbar/Navbar";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <div className="w-[85%] xl:w-[80%] mx-auto my-10">
          <section id="services">
            <ExploreServices />
          </section>
          <section id="features">
            <Services />
          </section>
        </div>
        <section id="contact">
          <TopFooter />
        </section>
      </main>
    </>
  );
}
