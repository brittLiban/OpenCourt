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

    const addLocation = (newLocation) => {
        setLocations(prevLocations => [...prevLocations, newLocation]);
    };

    return( 
    <>
        <Locations locations={locations} />
        <LocationsForm onAddLocation={addLocation} />
    </>
    );
}

export default LocationsPage;