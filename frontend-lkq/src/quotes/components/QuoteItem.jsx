import React, { useState, useContext, Fragment } from 'react';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import { AuthContext } from '../../shared/context/AuthContext';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FormElements/Button';
import Map from '../../shared/components/UIElements/Map';
import "./QuoteItem.css"

const QuoteItem = props => {
    
    const { isLoading, clientError, sendRequest, clearClientError } = useHttpClient();

    const currentAuth = useContext(AuthContext);

    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);
    
    const showDeleteWarningHandler = () => setShowConfirmModal(true);

    const cancelDeleteHandler = () => setShowConfirmModal(false);

    const confirmDeleteHandler =  async () => { 
        setShowConfirmModal(false);
        const url = `${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/quotes/${props.id}`
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
            console.log(error);
        }
    };



    return (
        <Fragment>
            <ErrorModal error={clientError} onClear={clearClientError} />
            <Modal 
                show={showMap} 
                onCancel={closeMapHandler} 
                header={props.address} 
                contentClass="quote-item__modal-content" 
                footerClass="quote-item__modal-actions" 
                footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className='map-container'>
                    <Map center={props.coordinates} zoom={16} />
                </div>
            </Modal>
            <Modal header="yes" footerClass="quote-item__modal-actions" show={showConfirmModal} onCancel={cancelDeleteHandler} footer={
                <Fragment>
                    <Button inverse onClick={cancelDeleteHandler}>Cancel</Button>
                    <Button danger onClick={confirmDeleteHandler} >DELETE</Button>
                </Fragment>
            }>
                <p>Do you want to delete? No Backsies... </p>
            </Modal>
            <li className="quote-item">
                <Card className="quote-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="quote-item__image">
                        <img src={`${props.author_ref_img}`} alt={props.title} />
                    </div>
                    <div className="quote-item__info">
                        <h2>“{props.text}”</h2>
                        <h3><a target='new' href={props.author_ref_url}>{props.author_name}</a></h3>
                        <p>{props.address}</p>
                        {(props.tags).map(e => <span>{e.name}, </span>)} 
                    </div>
                    <div className="quote-item__actions">
                        {/* <Button inverse onClick={openMapHandler}>view map</Button> */}
                        { currentAuth.userId === props.creatorId &&  <Fragment>
                            <Button to={`/quotes/${props.id}`}>edit</Button>
                            <Button danger onClick={showDeleteWarningHandler}>delete</Button>
                        </Fragment> }
                    </div>
                </Card>
            </li>

        </Fragment>
    );
}

export default QuoteItem;
