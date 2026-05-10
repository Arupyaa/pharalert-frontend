import ExploreServices from "../../features/Global/components/ExploreServices/ExploreServices";
import Hero from "../../features/Global/components/Hero/Hero";
import Services from "../../features/Global/components/Services/Services";
import TopFooter from "../../features/Global/components/Footer/TopFooter";
import Navbar from "../../features/Global/components/Navbar/Navbar";
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
