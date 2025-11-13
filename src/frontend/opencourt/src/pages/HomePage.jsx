import { Container, Typography } from "@mui/material";


function HomePage() {
    return( 
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 6 }}>
            <Typography data-cy="home-title" variant="h3" gutterBottom>
                Welcome to OpenCourt 🏀🎾🏐
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Find a court. Join a game. Play more, search less.
            </Typography>
        </Container>
    );
}

export default HomePage;