import { useState } from "react";
import "./App.css";
import carPhoto from "./assets/carphoto.jpg";
import DreamCarForm from "./components/DreamCarForm";
import CalendlyPanel from "./components/CalendlyPanel";
import CarList from "./components/CarList";
import Lightbox from "./components/Lightbox";
import InventoryView from "./components/InventoryView";

const dummyCars = [
    {
      Brand: "Tesla",
      Model: "Model 3 Performance",
      Year: 2023,
      Mileage: 12000,
      BodyType: "Sedan",
      Transmission: "Auto",
      Price: 45999,
      Photos: [carPhoto, carPhoto, carPhoto, carPhoto, carPhoto, carPhoto],
      IsFeatured: true,
      CarfaxVerified: true,
    },
    {
      Brand: "BMW",
      Model: "X5 M Sport",
      Year: 2022,
      Mileage: 18000,
      BodyType: "SUV",
      Transmission: "Auto",
      Price: 63999,
      Photos: [carPhoto, carPhoto, carPhoto],
      IsFeatured: true,
      CarfaxVerified: true,
    },
    {
      Brand: "Mercedes-Benz",
      Model: "C300 AMG Line",
      Year: 2021,
      Mileage: 24000,
      BodyType: "Sedan",
      Transmission: "Auto",
      Price: 42999,
      Photos: [carPhoto, carPhoto, carPhoto],
      IsFeatured: false,
      CarfaxVerified: true,
    },
    {
      Brand: "Audi",
      Model: "Q7 S line",
      Year: 2020,
      Mileage: 32000,
      BodyType: "SUV",
      Transmission: "Auto",
      Price: 51999,
      Photos: [carPhoto, carPhoto, carPhoto],
      IsFeatured: false,
      CarfaxVerified: false,
    },
    {
      Brand: "Porsche",
      Model: "911 Carrera",
      Year: 2019,
      Mileage: 15000,
      BodyType: "Coupe",
      Transmission: "Manual",
      Price: 89999,
      Photos: [carPhoto, carPhoto, carPhoto],
      IsFeatured: true,
      CarfaxVerified: true,
    },
    {
      Brand: "Range Rover",
      Model: "Velar R-Dynamic",
      Year: 2021,
      Mileage: 22000,
      BodyType: "SUV",
      Transmission: "Auto",
      Price: 76999,
      Photos: [carPhoto, carPhoto, carPhoto],
      IsFeatured: false,
      CarfaxVerified: false,
    },
  ];
function App() {
  const [view, setView] = useState("home"); // "home" | "inventory"
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

  if (view === "inventory") {
    return (
      <InventoryView
        cars={dummyCars}
        onBack={() => setView("home")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#1a1a4e_0%,#0f0f2d_40%,#0a0a1a_100%)] flex flex-col items-center justify-start md:justify-center p-3 md:p-5 font-ui">
      {/* Inventory button – top right */}
      {/* <div className="w-full max-w-[1200px] flex justify-end mb-4">
        <button
          onClick={() => setView("inventory")}
          className="inline-flex items-center gap-2 text-sm font-semibold
            bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
            text-white rounded-full px-5 py-2.5 shadow-lg
            transition-colors duration-150"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          View Inventory
        </button>
      </div> */}

      <div className="flex gap-6 w-full max-w-[1200px]">
        <div className="page-col flex flex-col w-full overflow-hidden rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md bg-[rgba(15,23,42,0.7)] md:[display:contents]">
          <CalendlyPanel />
          <DreamCarForm />
        </div>
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
