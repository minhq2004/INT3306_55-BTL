import { Card, CardFooter, Image, Button } from "@nextui-org/react";

export default function CardNext() {
  return (
    <div className="flex justify-center items-center my-8">
      <Card isFooterBlurred className="w-[200px] h-[200px]" radius="lg">
        <div className="h-full relative">
          <Image
            alt="Woman listing to music"
            className="object-cover w-[200px] h-[200px]"
            src="https://nextui.org/images/hero-card.jpeg"
          />
          <CardFooter
            className="absolute bottom-0 z-10 justify-between before:bg-white/10 
                       border-white/20 border-1 overflow-hidden py-1 before:rounded-xl 
                       rounded-large w-[calc(100%_-_8px)] shadow-small mx-1"
          >
            <p className="text-[10px] text-white/80">Available soon.</p>
            <Button
              className="text-[10px] text-white bg-black/20 min-w-fit h-6 px-2"
              radius="lg"
              size="sm"
              variant="flat"
            >
              Notify me
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
