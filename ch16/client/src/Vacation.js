import React, { useEffect, useState } from "react";

function NotifyWhenInSeason({ sku }) {
  const [registerEmail, setRegisterEmail] = useState(null);
  const [email, setEmail] = useState("");

  function onSubmit(event) {
    event.preventDefault();
    fetch(`http://localhost:3033/api/vacation/${sku}/notify-when-in-season`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (res.status < 200 || res.status > 299) {
        console.log(res);
        return alert("We had a problem processing this... Please try again");
      }
      setRegisterEmail(email);
    });
  }

  if (registerEmail) {
    return (
      <p>
        You will notified at {registerEmail} when this vacation is back in
        season!
      </p>
    );
  }

  return (
    <>
      Notify me when this vacation is in season:
      <input
        type="email"
        placeholder="(your email)"
        value={email}
        onChange={({ target: { value } }) => setEmail(value)}
      />
      <button onClick={onSubmit}>OK</button>
    </>
  );
}

function Vacation({ vacation }) {
  return (
    <div
      key={vacation.sku}
      style={{ border: "1px solid black", margin: "16px 0px", padding: "16px" }}
    >
      <h3>{vacation.name}</h3>
      <p>{vacation.description}</p>
      <span className="price">{vacation.price}</span>
      {!vacation.inSeason && (
        <div>
          <p>This vacation is not currently in season.</p>
          <NotifyWhenInSeason sku={vacation.sku} />
        </div>
      )}
    </div>
  );
}

function Vacations() {
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
          <Vacation key={vacation.sku} vacation={vacation} />
        ))}
      </div>
    </>
  );
}

export default Vacations;
