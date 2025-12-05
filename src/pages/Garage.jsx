import { useState, useCallback } from 'react';
import { cars } from '../data/garageData';
import CarModal from '../components/CarModal';
import Footer from '../components/Footer';
import GarageGrid from '../components/GarageGrid';
import './Garage.css';

function Garage() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCar(null);
  }, []);

  return (
    <div className="garage-page">
      <div id="garage-body">
        <div className="garage-header">
          <h1>My Garage</h1>
          <p>A collection of all the cars I've owned.</p>
        </div>
        <GarageGrid cars={cars} onCardClick={openModal} />
      </div>

      <Footer />

      <CarModal car={selectedCar} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default Garage;
