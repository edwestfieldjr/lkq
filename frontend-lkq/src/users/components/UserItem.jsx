import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import "./UserItem.css"

const UserItem = props => {
    return (
        <li>
            <div className="user-item">
                <Card className="user-item__content">
                    <Link to={`/${props.id}/quotes`}>
                        <div className="user-item__info">
                            <h2>{props.name}</h2>
                            <h3>{props.quoteCount > 0 ? props.quoteCount : 'No' } {props.quoteCount === 1 ? "quote" : "quotes"}</h3>
                        </div>
                    </Link>
                </Card>
            </div>
        </li>
    )
}

export default UserItem;