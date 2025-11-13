import { useState, useEffect } from "react";
import Users from '../components/Users'
import UsersForm from '../components/UsersForm';
import { getUsers } from '../api/Users';

function UsersPage() {
    const[users, setUsers] = useState([]);

    useEffect(() => {
        getUsers()
         .then(setUsers)
         .catch((err) => console.error("Error fetching users:", err));
    }, [])

    const addUser = (newUser) => {
        setUsers(prevUsers => [...prevUsers, newUser]);
    }

    return( 
    <>
        <Users users={users} />
        <UsersForm onAddUser={addUser} />
    </>
    );
}

export default UsersPage;