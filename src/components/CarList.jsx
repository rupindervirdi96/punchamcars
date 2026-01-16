function CarList({ cars, onPhotoClick }) {
  return (
    <div className="panel right-panel">
      <h2>Cars in stock</h2>
      <p className="panel-subtitle">
        A quick look at a few exciting options.
      </p>
      <div className="car-list">
        {cars.map((car, carIndex) => (
          <div className="car-card" key={carIndex}>
            <div className="car-card-header">
              <div>
                <h3>
                  {car.Brand} {car.Model}
                </h3>
                <span className="car-year">{car.Year}</span>
              </div>
              {car.IsFeatured && (
                <span className="car-flag">Featured</span>
              )}
              <span className="car-price">
                ${car.Price.toLocaleString()}
              </span>
            </div>
            <div className="car-card-body">
              <p>
                {car.BodyType} - {car.Mileage.toLocaleString()} km
              </p>
              <div className="car-photo-strip">
                {car.Photos.map((photoSrc, photoIndex) => (
                  <button
                    key={photoIndex}
                    type="button"
                    className="car-photo-button"
                    onClick={() => onPhotoClick(carIndex, photoIndex)}
                  >
                    <img
                      src={photoSrc}
                      alt={`${car.Brand} ${car.Model} photo ${photoIndex + 1}`}
                      className="car-photo"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarList;
