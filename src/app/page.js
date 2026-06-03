import AboutSection from "@/components/Home/About";
import Carousel from "@/components/Home/Carousel";
import ClienteleSlider from "@/components/Home/ClientSlider";
import FormSection from "@/components/Home/FormSection";
import Locations from "@/components/Home/Locations";
import Image from "next/image";

export default function Home() {
  return (
    <div className="items-center bg-zinc-50 font-san">
      {/* <Carousel /> */}
      <FormSection />
      <AboutSection />
      <ClienteleSlider />
      <Locations />
    </div>
  );
}
