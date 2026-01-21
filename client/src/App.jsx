import { useState } from "react";
import "./App.css";
import carPhoto from "./assets/carphoto.jpg";
import DreamCarForm from "./components/DreamCarForm";
import CalendlyPanel from "./components/CalendlyPanel";
import CarList from "./components/CarList";
import Lightbox from "./components/Lightbox";

const dummyCars = [
    {
      Brand: "Tesla",
      Model: "Model 3 Performance",
      Year: 2023,
      Mileage: 12000,
      BodyType: "Sedan",
      Price: 45999,
      Photos: [carPhoto, carPhoto, carPhoto],
      IsFeatured: true,
    },
    {
      Brand: "BMW",
      Model: "X5 M Sport",
      Year: 2022,
      Mileage: 18000,
      BodyType: "SUV",
      Price: 63999,
      Photos: [carPhoto, carPhoto, carPhoto],
      IsFeatured: true,
    },
    {
      Brand: "Mercedes-Benz",
      Model: "C300 AMG Line",
      Year: 2021,
      Mileage: 24000,
      BodyType: "Sedan",
      Price: 42999,
      Photos: [carPhoto, carPhoto, carPhoto],
      IsFeatured: false,
    },
    {
      Brand: "Audi",
      Model: "Q7 S line",
      Year: 2020,
      Mileage: 32000,
      BodyType: "SUV",
      Price: 51999,
      Photos: [carPhoto, carPhoto, carPhoto],
      IsFeatured: false,
    },
    {
      Brand: "Porsche",
      Model: "911 Carrera",
      Year: 2019,
      Mileage: 15000,
      BodyType: "Coupe",
      Price: 89999,
      Photos: [carPhoto, carPhoto, carPhoto],
      IsFeatured: true,
    },
    {
      Brand: "Range Rover",
      Model: "Velar R-Dynamic",
      Year: 2021,
      Mileage: 22000,
      BodyType: "SUV",
      Price: 76999,
      Photos: [carPhoto, carPhoto, carPhoto],
      IsFeatured: false,
    },
  ];
function App() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeCarIndex, setActiveCarIndex] = useState(0);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const openLightbox = (carIndex, photoIndex) => {
    setActiveCarIndex(carIndex);
    setActivePhotoIndex(photoIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const currentCar = dummyCars[activeCarIndex];
  const currentPhotos = currentCar?.Photos || [];

  const showNextPhoto = () => {
    if (!currentPhotos.length) return;
    setActivePhotoIndex((prev) => (prev + 1) % currentPhotos.length);
  };

  const showPrevPhoto = () => {
    if (!currentPhotos.length) return;
    setActivePhotoIndex((prev) => (prev - 1 + currentPhotos.length) % currentPhotos.length);
  };

  return (
    <div className="App">
      <div className="main-layout">
        <DreamCarForm />
        <CalendlyPanel />
        {/* <CarList cars={dummyCars} onPhotoClick={openLightbox} /> */}
      </div>

      {/* <Lightbox
        open={lightboxOpen}
        photos={currentPhotos}
        activeIndex={activePhotoIndex}
        onClose={closeLightbox}
        onNext={showNextPhoto}
        onPrev={showPrevPhoto}
        onDotClick={setActivePhotoIndex}
        currentCar={currentCar}
      /> */}
    </div>
  );
}

export default App;
