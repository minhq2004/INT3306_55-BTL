import { useState, useEffect } from "react";
import { Card, CardBody, Button, Image } from "@nextui-org/react";
import { ChevronRight } from "lucide-react";

// Cấu hình API
const API_KEY = "B43gtozbhTgx8yrT7nahGz3TvskudK0pieUqDWOZjNw";
const API_URL = "https://api.unsplash.com/search/photos";

// Dữ liệu cho các thẻ giới thiệu địa điểm
const flightDealsData = [
  {
    id: 1,
    name: "Hà Nội",
    title: "Thủ đô nghìn năm văn hiến",
    description:
      "Khám phá 36 phố phường cổ, thưởng thức ẩm thực đường phố độc đáo và tham quan các di tích lịch sử văn hóa.",
    price: "Từ 1.990.000đ",
    query: "hanoi",
  },
  {
    id: 2,
    name: "Đà Nẵng",
    title: "Thành phố của những cây cầu",
    description:
      "Tận hưởng bãi biển Mỹ Khê tuyệt đẹp, khám phá Bà Nà Hills và thưởng thức ẩm thực miền Trung độc đáo.",
    price: "Từ 2.190.000đ",
    query: "danang dragon bridge vietnam",
  },
  {
    id: 3,
    name: "Đà Lạt",
    title: "Thành phố ngàn hoa",
    description:
      "Trải nghiệm khí hậu mát mẻ quanh năm, tham quan các khu vườn hoa và thưởng thức cà phê trong không khí lãng mạn.",
    price: "Từ 1.890.000đ",
    query: "Đà Lạt",
  },
  {
    id: 4,
    name: "Phú Quốc",
    title: "Đảo ngọc thiên đường",
    description:
      "Khám phá những bãi biển hoang sơ, lặn ngắm san hô và thưởng thức hải sản tươi ngon nhất Việt Nam.",
    price: "Từ 2.490.000đ",
    query: "phu quoc beach vietnam",
  },
  {
    id: 5,
    name: "Nha Trang",
    title: "Thành phố biển xinh đẹp",
    description:
      "Tận hưởng những bãi biển trong xanh, vui chơi ở Vinpearl Land và khám phá văn hóa Chăm độc đáo.",
    price: "Từ 2.290.000đ",
    query: "nha trang beach vietnam",
  },
];

const FlightDealCard = ({ destination, onBooking }) => {
  return (
    <Card
      isPressable
      className="group relative h-[400px] bg-white/20 backdrop-blur-sm border border-white/10"
    >
      <CardBody className="p-0 overflow-hidden">
        <div className="relative h-full w-full">
          <Image
            removeWrapper
            alt={destination.name}
            className="absolute z-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            src={destination.image}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>

          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <p className="text-sm text-white/80 mb-1">{destination.title}</p>
            <h3 className="text-3xl font-bold mb-2 text-white">
              {destination.name}
            </h3>
            <p className="text-sm text-white/90 line-clamp-2 mb-4">
              {destination.description}
            </p>
            <div className="flex items-center justify-end">
              <Button
                className="bg-white/10 backdrop-blur-sm text-white px-6 hover:bg-white/20 transition-all"
                radius="full"
                size="sm"
                onPress={onBooking}
              >
                Đặt vé bay ngay!
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const FlightDeals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const visibleSlides = 3;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const destinationsWithImages = await Promise.all(
          flightDealsData.map(async (dest) => {
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

        setDestinations(destinationsWithImages);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching images:", err);
        setLoading(false);
        setDestinations(
          flightDealsData.map((dest) => ({
            ...dest,
            image: "/placeholder-image.jpg",
          }))
        );
      }
    };

    fetchImages();
  }, []);

  const handleBooking = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const nextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % (destinations.length - visibleSlides + 1)
    );
  };

  if (loading) {
    return (
      <section className="my-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[400px] bg-gray-200 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-16">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <h2 className="text-2xl md:text-4xl font-bold text-black/70">
            Khám phá
            <span className="text-black/70 ml-2">chuyến bay ưu đãi</span>
          </h2>

          <button
            className="flex items-center space-x-2 cursor-pointer group bg-white/5 px-6 py-3 rounded-full hover:bg-white/10 transition-all"
            onClick={nextSlide}
          >
            <span className="text-black/80 font-medium group-hover:text-teal-500 transition-colors">
              Xem thêm
            </span>
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {destinations
            .slice(currentIndex, currentIndex + visibleSlides)
            .map((destination) => (
              <FlightDealCard
                key={destination.id}
                destination={destination}
                onBooking={handleBooking}
              />
            ))}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: destinations.length - visibleSlides + 1 }).map(
            (_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentIndex === index
                    ? "bg-teal-400"
                    : "bg-white/20 hover:bg-white/30"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default FlightDeals;
