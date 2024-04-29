import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import "../app/globals.css";
import image1 from './assets/image1.jpg';
import image2 from './assets/image2.jpg';
import image3 from './assets/image3.jpg';
import image4 from './assets/image4.jpg';
import image5 from './assets/image5.jpg';

function getImageByIndex(index) {
  switch (index) {
    case 1:
      return image1;
    case 2:
      return image2;
    case 3:
      return image3;
    case 4:
      return image4;
    case 5:
      return image5;
    default:
      return null; // Handle the case when index is out of range
  }
}

const About = () => (
  <div className="w-full py-20 lg:py-40 bg-background text-white">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-10">
        <div className="flex gap-4 flex-col items-start">
          <div>
            <Badge>History</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
                A family business since 1986
            </h2>
            <p className="text-lg  max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground  text-left">
                Discover [Company Name], your trusted family-owned furniture company 
                in Salt Lake City since 1986. With a dedication to honesty, dependability, 
                and exceptional customer service, we handcraft each piece of furniture with 
                care and precision.
            </p>
          </div>
        </div>

        <div className="w-full max-w-full px-6">
          <Carousel>
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="flex flex-col gap-1 rounded-md aspect-video bg-muted items-center justify-center p-6">
                    <img src={getImageByIndex(index + 1)} alt="Platform Screenshot" />
                    <span className="text-sm">
                      Platform Screenshot {index + 1}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  </div>
);

export default About;