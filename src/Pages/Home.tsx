import React from "react";
import NavBar from "../Components/Navigationbar";
import AuthDetails from "../Components/AuthDetails";
import Carousel from "../Components/Carousel";
import RealTimeChart from "../Components/Realtimechart";
import LifeChart from "../Components/LifeChart";
import WebSocketConnection from "../services/WebsocketConnection";
import '../styles/crypto.css';
import LandingPage from "../Components/LandingPage";
import OurFeatures from "../Components/OurFeatures";
import CryptoTable from "../Components/CryptoTable";
import ExploreCryptocurrency from "../Components/ExploreCryptocurrency";
import Footer from "../Components/Footer";
const Home=() => {
    return(
        <div>
            
<div className="Container"> 
<NavBar/>
<LandingPage />
<Carousel />
<OurFeatures />
<ExploreCryptocurrency />
<Footer />

  <AuthDetails />
      
         </div>
        </div>
    )

}

export default Home;