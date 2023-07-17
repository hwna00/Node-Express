import React, { useState } from "react";
import { Link } from "react-router-dom";

function Vacation() {
  const [vacations, setVacations] = useState([]);

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
