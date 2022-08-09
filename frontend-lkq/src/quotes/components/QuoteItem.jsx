import React, { useState, useEffect, useContext, Fragment } from 'react';
import { useHttpClient } from '../../shared/hooks/HttpClientHook';
import { AuthContext } from '../../shared/context/AuthContext';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FormElements/Button';
import "./QuoteItem.css"

const QuoteItem = props => {

    const { isLoading, clientError, sendRequest, clearClientError } = useHttpClient();
    
    const currentAuth = useContext(AuthContext);
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
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

    const photoSearchSynonyms = [
        ["inspiring", "encouraging", "exciting", "exhilarating", "heartening", "inspirational", "uplifting"],
        ["landscape", "panoramic", "scenery", "exhilarating", "vista", "pastoral", "uplifting"],
        ["tranquil", "calm", "restful", "pleasant", "quiet", "still", "relaxing", "soothing", "undisturbed"]
    ]; // three indexes
    let photoSearchSynonymsString = photoSearchSynonyms.map(e => e[Math.floor(Math.random()*e.length)]).join(',');
    console.log(photoSearchSynonyms.map(e => e[Math.floor(Math.random()*e.length)]).join(','));
    console.log("====")

    return (
        <Fragment>
            <ErrorModal error={clientError} onClear={clearClientError} />

            <Modal header="Delete Item..." footerClass="quote-item__modal-actions" show={showConfirmModal} onCancel={cancelDeleteHandler} footer={
                    <Fragment>
                        <Button inverse onClick={cancelDeleteHandler}>Cancel</Button>
                        <Button danger onClick={confirmDeleteHandler} >DELETE</Button>
                    </Fragment>
            }>
                <p>Do you want to delete this quote? by {props.author_name} (quote: {props.text}).</p>
            </Modal>
            
            <li className="quote-item" >
                <Card className="quote-item__content" /* style={{  
                    backgroundImage: `url("https://source.unsplash.com/random/1920x1080/?inspiration,landscape,peaceful${(props.tags).map(e => e.name).join(',')}")`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }} */>
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className="quote-item__image">
                        <img src={`https://source.unsplash.com/random/1920x1080/?inspiration,landscape,peaceful${photoSearchSynonyms.map(e => e[Math.floor(Math.random()*e.length)]).join(',')}${props.tags.length &&','}${props.tags.map(e => e.name).join(',')}`} alt="Courtesy: unsplash.com" />
                    </div>
                    <div className="quote-item__info">
                        <h2>“{props.text}”</h2>
                        <h3><a target='new' href={`/quotes/user/${props.userId}`}>{props.author_name}</a></h3>
                        {props.author_ref_img && <Avatar image={props.author_ref_img} alt={props.author_name} width="100px"/>}
                        {props.author_ref_url && <p><a target='new' href={props.author_ref_url}>Wikipedia Bio</a></p>}
                        <p>categories/tags: {(props.tags).map(e => <span key={e.id}><a href={`/quotes/tag/${e.id}`}>{e.name}</a>, </span>)}</p> 
                        <p>posted by: <a href={`/quotes/user/${props.creatorId}`}>{props.creatorName}</a></p>
                    </div>


                    <div className="quote-item__actions">
                        <div><p>Visible to {props.isPublic ? <span> Everyone </span> : <span> User and Admin </span>}</p></div>
                        { (currentAuth.userId === props.creatorId || currentAuth.isAdmin) && 
                            <Fragment>
                                <Button to={`/quotes/edit/${props.id}`}>Edit</Button>
                                <Button danger onClick={showDeleteWarningHandler}>Delete</Button>
                            </Fragment> 
                        }
                    </div>
                </Card>
            </li>

        </Fragment>
    );
}

export default QuoteItem;
