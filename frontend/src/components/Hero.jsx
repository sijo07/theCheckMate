import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-black h-screen flex flex-col justify-center items-center text-center px-6">
      {/* Hero Image */}
      <img
        src="src/assets/icon.png"
        alt="Cyber Security Icon"
        className="h-80 w-80 md:h-96 md:w-[50%] object-cover"
      />

      {/* Hero Text */}
      <h2 className="text-5xl md:text-[96px] font-bold text-gray-200 leading-tight">
        CheckMate
      </h2>
      <p className="text-2xl text-gray-400">Cyber Incident Tracker</p>

      {/* Hero Button */}
      <Link to="/dashboard">
        <Button className="mt-4 bg-red-800 hover:bg-red-700 text-white px-6 py-3 text-lg rounded-3xl">
          Get Started
        </Button>
      </Link>
    </section>
  );
};

export default Hero;
