import { useState } from 'react'
import { Container } from "@mui/material";

function Users(){
    const [formData, setFormData] = useState({
        user_name: ""
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
        const res = await fetch(`/api/users`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        })

        const data = await res.json();
        if (data.error) {
            setError("Invalid Input");
        }

        setFormData({user_name: ""});
        } catch (err) {
        console.error(err);
        }
    }

    return(
        <Container align="center">
            <h3>Add a User</h3>
            <form onSubmit={handleSubmit}>
                <div>
                <label>User Name:</label>
                <input 
                    type="text" 
                    name= "user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    onFocus={() => error && setError("")}
                />
                </div>
                <em>{error}</em>
                <br />
                <button type="submit">Add User</button>
            </form>
        </Container>
    )
}

export default Users;