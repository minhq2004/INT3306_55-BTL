import { FlightDeals, Hero } from "../../components";
import Places from "../../components/Places";

const Flights = () => {
  return (
    <main className="min-h-screen">
      {/* Hero section with appropriate spacing */}
      <section className="pt-20">
        <Hero />
      </section>

      {/* Flight Deals section */}

      <FlightDeals />

      {/* Places section */}

      <Places />
    </main>
  );
};

export default Flights;
