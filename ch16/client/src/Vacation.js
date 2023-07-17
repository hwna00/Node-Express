import React, { useEffect, useState } from "react";

function Vacation() {
  const [vacations, setVacations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3033/api/vacations")
      .then((res) => res.json())
      .then(setVacations);
  }, []);

  return (
    <>
      <h2>Vacations</h2>
      <div className="vacations">
        {vacations.map((vacation) => (
          <div key={vacation.sku}>
            <h3>{vacation.name}</h3>
            <p>{vacation.description}</p>
            <span className="price">{vacation.price}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default Vacation;
