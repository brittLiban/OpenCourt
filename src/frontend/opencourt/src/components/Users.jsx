import { Container, Typography, List, ListItem, ListItemText } from "@mui/material";

function Users({users}) {

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom align="center">
        Created Users
      </Typography>

      {users.length === 0 ? (
        <Typography variant="body1" align="center">
          No users yet. Create one!
        </Typography>
      ) : (
        <List>
          {users.map((user, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={`${user.user_id} | ${user.user_name}`} />
            </ListItem>
          ))}
        </List>
      )}

    </Container>
  );
}

export default Users;

