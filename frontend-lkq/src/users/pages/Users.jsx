import React, { useState, useEffect, Fragment } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import UsersList from '../components/UsersList'; 

const Users = () => {
    
    const {isLoading, clientError, sendRequest, clearClientError} = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState(undefined);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(`http://${window.location.hostname}:5000/api/users`);

                setLoadedUsers(responseData.users);
            } catch (error) {};
        };
        fetchUsers();
    }, [sendRequest]);


    return (<Fragment>
        <ErrorModal error={clientError} onClear={clearClientError} />
        {isLoading && <div className="center"><LoadingSpinner asOverlay /></div>}
        <h2 className="center">Registered Users</h2>
        {!isLoading && loadedUsers && <UsersList items={loadedUsers}/>}
    </Fragment>);
};

export default Users;
