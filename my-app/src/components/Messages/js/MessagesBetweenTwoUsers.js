import '../css/MessagesBetweenTwoUsers.css'
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { messagesSelector} from '../../../store/messageReducer/messagesReducer';
import { useContext, useEffect } from 'react';
import { userSelector } from '../../../store/userReducer/userReducer';
import { currentUserSelector, setCurrentUserAction } from '../../../store/authReducer/authReducer'
import { getAllUsersAction } from '../../../store/userReducer/userReducer';
import { useForm } from 'react-cool-form';
import { addNewMessageAction } from '../../../store/messageReducer/messagesReducer';
import { findUserById } from '../../../store/userReducer/userReducer';

const MessagesBetweenTwoUsers = () => {

    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(setCurrentUserAction())
    // }, [dispatch])

    useEffect(() => {
        dispatch(getAllUsersAction())
    }, [dispatch])

    const messages = useSelector(messagesSelector);
    // const currentUserId = useSelector(currentUserSelector);

    const currentUserId = JSON.parse(localStorage.getItem('USER_ID'));
    
    const { id } = useParams(); 

    const users = useSelector(userSelector);

    const user = findUserById(users, id)

    let allMessagedByTwoUsers = messages.filter(
        el => (el.sentBy === id && el.recipient === currentUserId)
            || (el.sentBy === currentUserId && el.recipient === id)
    );

    const { form } = useForm({
        defaultValues: { text: ''},
        onSubmit: (values, { reset }) => {
            const newValue = {...values, sentBy: currentUserId, recipient: id}
            console.log('onSubmit: ', newValue);
            dispatch(addNewMessageAction(newValue));
            reset();
        }
    })  
          
    // console.log('messages: ', messages)
    // console.log('allMessagedByTwoUsers:', allMessagedByTwoUsers);

    // console.log('sentBy: ', id)
    // console.log('currentUser: ', currentUserId)

    return (
        <div className="wrapper-msg">
                <div className="wrapper-msg-left">
                    <div id="box-top-msgs">
                    {allMessagedByTwoUsers.map(el => {
                        if(el.sentBy === currentUserId) {
                            return (
                                    <div className="right">{el.text}
                                        <p id="sign">me</p>
                                    </div>
                                )
                        } else {
                            return (
                                    <div className="left">
                                        {el.text}
                                    </div>
                            )
                        }
                    })}
                </div>
                <div id="box-bottom-input">
                <form ref={form}>
                <p id="inp-msg-title">Write your message</p>
                <textarea id="textarea-msg" name="text"></textarea>
                <br/>
                <button type="submit">Send</button>
                </form>
                    
                </div>
                </div>
                {users.length !== 0 && <div className="wrapper-msg-right">
                <div className="box" id="box-right">
                    <div id="box-right-top">
                    <div id="box-right-img" style={{ "background": `url(${user.img}) no-repeat center`, "backgroundSize": "100%" }}></div>
                    </div>
                    <div id="box-right-bottom">
                        <div id="box-right-bottom-info">
                            <h4 id="text-user-name">{user.firstName} {user.lastName}</h4>
                            <p className="text-user" id="text-user-about">Some user´s information</p><br />
                            <p className="text-user" id="text-user-learn">Learn: {user.practiceLanguage}</p>
                            <p className="text-user" id="text-user-native">Native: {user.nativeLanguage}</p>
                        </div>
                        <div id="box-right-bottom-btn">
                            <button className="right-bottom-btn" id="btn-view-profile">view profile</button>                          
                        </div>
                    </div>
                </div>
                </div> }
        </div>
    )
}

export default MessagesBetweenTwoUsers;



