import React, { useState, useContext, Fragment } from 'react';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import { AuthContext } from '../../shared/context/AuthContext';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FormElements/Button';
// import Map from '../../shared/components/UIElements/Map';
import "./QuoteItem.css"

const QuoteItem = props => {
    
    const { isLoading, clientError, sendRequest, clearClientError } = useHttpClient();

    const currentAuth = useContext(AuthContext);

    // const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // const openMapHandler = () => setShowMap(true);
    // const closeMapHandler = () => setShowMap(false);
    
    const showDeleteWarningHandler = () => setShowConfirmModal(true);

    const cancelDeleteHandler = () => setShowConfirmModal(false);

    const confirmDeleteHandler =  async () => { 
        setShowConfirmModal(false);
        const url = `http://${window.location.hostname}:5000/api/quotes/${props.id}`
        try {
            await sendRequest(
                url,
                'DELETE',
                null,
                {
                    Authorization: `Bearer ${currentAuth.token}` 
                }
            );
            props.onDelete(props.id);
        } catch (error) {
            throw (error);
        }
    };



    return (
        <Fragment>
            <ErrorModal error={clientError} onClear={clearClientError} />

            <Modal header="Delete Item..." footerClass="quote-item__modal-actions" show={showConfirmModal} onCancel={cancelDeleteHandler} footer={
                    <Fragment>
                        <Button inverse onClick={cancelDeleteHandler}>Cancel</Button>
                        <Button danger onClick={confirmDeleteHandler} >DELETE</Button>
                    </Fragment>
            }>
                <p>Do you want to delete this quote? </p>
            </Modal>
            
            <li className="quote-item">
                <Card className="quote-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="quote-item__image">
                        <img src={`${props.author_ref_img}`} alt={props.author_name} />
                    </div>
                    <div className="quote-item__info">
                        <h2>“{props.text}”</h2>
                        <h3><a target='new' href={props.author_ref_url}>{props.author_name}</a></h3>
                        <p><a href={`/quotes/user/${props.creatorId}`}>{props.creatorName}</a></p>
                        {(props.tags).map(e => <span key={e.id}><a href={`/quotes/tag/${e.id}`}>{e.name}</a>, </span>)} 
                    </div>
                    <div className="quote-item__actions">
                        { (currentAuth.userId === props.creatorId || currentAuth.isAdmin) && 
                            <Fragment>
                                <Button to={`/quotes/edit/${props.id}`}>edit</Button>
                                <Button danger onClick={showDeleteWarningHandler}>delete</Button>
                            </Fragment> 
                        }
                    </div>
                </Card>
            </li>

        </Fragment>
    );
}

export default QuoteItem;
