import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";

function Locations({locations}) {

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Created Locations
      </Typography>

      {locations.length === 0 ? (
        <Typography variant="body1" align="center">
          No locations yet. Create one!
        </Typography>
      ) : (
        <List>
          {locations.map((location, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={`#${location.location_id}. ${location.location_name} | ${location.address}`} />
            </ListItem>
          ))}
        </List>
      )}

    </Container>
  );
}

export default Locations;