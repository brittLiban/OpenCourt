import { useState } from 'react'
import { Container } from "@mui/material";

function LocationsForm(){
    const [formData, setFormData] = useState({
        location_name: "",
        address: ""
    });
    const [error, setError] = useState("");
  
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
          
        try {
            const res = await fetch(`/api/locations`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
        })

        const data = await res.json();
            if (data.error) {
                setError("Invalid Input");
        }

        setFormData({location_name: "", address: ""});
        } catch (err) {
            console.error(err);
        }
    }
  
    return(
        <Container align="center">
            

            <h3>Add a Location</h3>
            <form onSubmit={handleSubmit}>
                <div>
                <label>Location Name:</label>
                <input 
                    type="text" 
                    name="location_name"
                    value={formData.location_name}
                    onChange={handleChange}
                    onFocus={() => error && setError("")}
                />
                </div>

                <div>
                <label>Address:</label>
                <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onFocus={() => error && setError("")}
                />
                </div>
                <em>{error}</em>
                <br />
                <button type="submit">Add Location</button>
            </form>
        </Container> 
      )
  }

export default LocationsForm;