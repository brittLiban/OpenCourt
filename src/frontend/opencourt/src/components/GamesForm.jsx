import { useState } from 'react'
import { Container } from "@mui/material";


function GamesForm({onAddGame}){
    const [formData, setFormData] = useState({
        game_name: "",
        location_id: ""
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
        const res = await fetch(`/api/games`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        })

        const data = await res.json();
        if (data.error) {
            setError("Invalid Input");
        }
        
        onAddGame({ game_name: formData.game_name, location_id: formData.location_id });

        setFormData({game_name: "", location_id: ""});
        } catch (err) {
        console.error(err);
        }
    }

    return(
        <Container align="center">
            <h3>Add an Event</h3>
            <form onSubmit={handleSubmit}>
                <div>
                <label>Game Name:</label>
                <input 
                    type="text" 
                    name= "game_name"
                    value={formData.game_name}
                    onChange={handleChange}
                    onFocus={() => error && setError("")}
                />
                </div>

                <div>
                <label>Location ID:</label>
                <input 
                    type= "number" 
                    name= "location_id"
                    value={formData.location_id}
                    onChange={handleChange}
                    onFocus={() => error && setError("")}
                />
                </div>
                <em>{error}</em>
                <br />
                <button type="submit">Add Game</button>
            </form>
        </Container> 
    )
}

export default GamesForm;