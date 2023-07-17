import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import logo from "./img/logo.png";
import Vacation from "./Vacation";

function Home() {
  return (
    <div>
      <h2>Welcome to Meadowlark Travel</h2>
      <p>
        Checkout our <Link to={"/about"}>about</Link> page!
      </p>
    </div>
  );
}

function About() {
  return "About";
}

function NotFound() {
  return "NotFound";
}

function App() {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>Meadowlark Travel</h1>
          <Link to={"/"}>
            <img src={logo} alt="" Meadowlark Travel Logo />
          </Link>
        </header>
      </div>
      <Routes>
        <Route path="/about" exact element={<About />} />
        <Route path="/vacations" exact element={<Vacation />} />
        <Route path="/" exact element={<Home />} />
        <Route element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
