import { useState, useEffect } from "react";
import Locations from '../components/Locations'
import LocationsForm from '../components/LocationsForm';
import { getLocations } from "../api/Locations";

function LocationsPage() {
    const[locations, setLocations] = useState([]);

      useEffect(() => {
        getLocations()
        .then(setLocations)
        .catch((err) => console.error("Error fetching events:", err));
    }, []);


    return( 
    <>
        <Locations locations={locations} />
        <LocationsForm />
    </>
    );
}

export default LocationsPage;