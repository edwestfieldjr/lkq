import React from "react";

import UserItem from "./UserItem"
import "./UsersList.css"

const UsersList = props => {
    if (props.items.length > 0) {
        return (
            
            <ul className="users-list">
                {props.items.map( 
                    user => {   
                        return (
                            <UserItem 
                                key={user.id} 
                                name={user.name} 
                                isAdmin={user.isAdmin} 
                                id={user.id} 
                                // image={user.image}
                                quoteCount={user.quotes.length}
                            />
                        )
                    }
                )}
            </ul>
        );
    } else {
            return (<div className="center"><h2>ZERO USERS</h2></div>);
    }
}

export default UsersList;