import { useState, useEffect } from "react";
import { Card, CardBody, Button, Image } from "@nextui-org/react";
import { ChevronRight, ArrowRight } from "lucide-react";

// Cấu hình API
const API_KEY = "B43gtozbhTgx8yrT7nahGz3TvskudK0pieUqDWOZjNw";
const API_URL = "https://api.unsplash.com/search/photos";

const PlacesCard = ({ image, title, name, desc, onBooking }) => {
  return (
    <Card
      isPressable
      className="group relative w-full h-[400px] bg-black/20 backdrop-blur-sm border border-white/10"
    >
      <CardBody className="p-0 overflow-hidden">
        <div className="relative h-full w-full">
          <Image
            removeWrapper
            alt={name}
            className="absolute z-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            src={image}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>

          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <p className="text-sm text-white/80 mb-1">{title}</p>
            <h3 className="text-3xl font-bold mb-2 text-white">{name}</h3>
            <p className="text-sm text-white/90 line-clamp-2 mb-4">{desc}</p>

            <div className="flex items-center justify-between">
              <Button
                className="bg-white/10 backdrop-blur-sm text-white px-6 hover:bg-white/20 transition-all"
                radius="full"
                size="sm"
                onPress={onBooking}
              >
                Booking now
              </Button>

              <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group/learn">
                <span className="text-sm">Learn More</span>
                <ChevronRight className="h-5 w-5 group-hover/learn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const destinationsData = [
          {
            query: "Ha Long Bay Vietnam",
            title: "Experience the limestone karsts in",
            name: "Vietnam",
            desc: "Ha Long Bay features thousands of limestone karsts and isles in various shapes and sizes, forming a spectacular seascape of limestone pillars.",
          },
          {
            query: "Grand Canyon USA",
            title: "Explore the natural wonder in",
            name: "United States",
            desc: "The Grand Canyon, carved by the Colorado River, is a testament to 2 billion years of geological history and one of America's most iconic landscapes.",
          },
          {
            query: "Cotswolds England",
            title: "Discover the countryside in",
            name: "England",
            desc: "The Cotswolds, with its honey-colored cottages and rolling hills, represents the quintessential English countryside and traditional village life.",
          },
        ];

        const placesData = await Promise.all(
          destinationsData.map(async (dest) => {
            const response = await fetch(
              `${API_URL}?query=${dest.query}&client_id=${API_KEY}&per_page=1`
            );

            if (!response.ok) throw new Error("Failed to fetch images");

            const data = await response.json();
            const image = data.results[0]?.urls?.regular;

            return {
              ...dest,
              image: image || "/placeholder-image.jpg",
            };
          })
        );

        setPlaces(placesData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching places:", err);
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);
  const handleBooking = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="my-16">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full h-[400px] bg-gray-200 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-16">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <h2 className="text-2xl md:text-4xl font-bold text-black">
            Explore unique
            <span className="text-black"> places to stay</span>
          </h2>

          <button className="flex items-center space-x-2 cursor-pointer group bg-white/5 px-6 py-3 rounded-full hover:bg-white/10 transition-all">
            <span className="text-black/80 font-medium group-hover:text-white transition-colors">
              View All
            </span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {places.map((place, index) => (
            <PlacesCard
              key={index}
              image={place.image}
              title={place.title}
              name={place.name}
              desc={place.desc}
              onBooking={handleBooking}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Places;
