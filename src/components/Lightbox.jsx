import { useState } from "react";
import closeIcon from "../assets/closeIcon.png";
import nextIcon from "../assets/nextIcon.png";
import backIcon from "../assets/backIcon.png";

function Lightbox({
  open,
  photos,
  activeIndex,
  onClose,
  onNext,
  onPrev,
  onDotClick,
  currentCar,
}) {
  const [touchStartX, setTouchStartX] = useState(null);

  if (!open || !photos || photos.length === 0) {
    return null;
  }

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    const threshold = 50;
    if (diff > threshold) {
      onPrev();
    } else if (diff < -threshold) {
      onNext();
    }
    setTouchStartX(null);
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button
        type="button"
        className="lightbox-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <img src={closeIcon} alt="Close" />
      </button>
      <div
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* <button
          type="button"
          className="lightbox-nav lightbox-nav-left"
          onClick={onPrev}
        >
          <img src={backIcon} alt="Previous" />
        </button> */}
        <img
          src={photos[activeIndex]}
          alt={`${currentCar?.Brand ?? "Car"} ${
            currentCar?.Model ?? ""
          } large`}
          className="lightbox-image"
        />
        {/* <button
          type="button"
          className="lightbox-nav lightbox-nav-right"
          onClick={onNext}
        >
          <img src={nextIcon} alt="Next" />
        </button> */}
        <div className="lightbox-dots">
          {photos.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`lightbox-dot${
                index === activeIndex ? " lightbox-dot-active" : ""
              }`}
              onClick={() => onDotClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Lightbox;
