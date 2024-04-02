import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Banner3 from '../Images/img_3.png';

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark">
      <div className="container-fluid">
          <img className = "tvs-logo" src={Banner3} />
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
          </div>
      </div>
      </nav>
    </>
  )
}

export default Navbar