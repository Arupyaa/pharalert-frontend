import ExploreServices from "../components/LandingPage/exploreServices/ExploreServices";
import Hero from "../components/LandingPage/hero/Hero";
import Services from "../components/LandingPage/services/Services";
import TopFooter from "../components/LandingPage/footer/TopFooter";
import Navbar from "../components/General/navbar/Navbar";
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="w-[80%] mx-auto my-10">
        <ExploreServices />
        <Services />
      </div>
      <TopFooter />
    </>
  );
}
