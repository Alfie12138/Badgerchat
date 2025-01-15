import React, { useEffect, useState,createRef,useContext } from "react"
import {Row,Col,Pagination } from "react-bootstrap";
import BadgerMessage from "./BadgerMessage";
import Button from 'react-bootstrap/Button';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [currentPage,setCurrentPage]=useState(1);
    const titleref=createRef();
    const contentref=createRef();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const [currentUser, setCurrentUser] = useState(null);

    const handleDelete = (id) => {
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?id=${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => {
            if (res.status === 200) {
                alert("Successfully deleted the post!");
                loadMessages(); 
            } else {
                alert("We encountered an error while deleting the post!");
            }
        })
    };
    

    const loadCurrentUser = () => {
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/whoami`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.isLoggedIn) {
                setCurrentUser(data.user); // 设置当前用户
            } else {
                setCurrentUser(null);
            }
        })
    };

    function handlePost(e){
        e?.preventDefault();
        if(!loginStatus){
            alert("You must be logged in to post!")
            return
        }

        const title=titleref.current.value;
        const content=contentref.current.value;

        if(!title||!content){
            alert("You must provide both a title and content!")
            return
        }

        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?chatroom=${props.name}`,{
            method:'POST',
            credentials:'include',
            headers:{
                "X-CS571-ID": CS571.getBadgerId(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                content: content
            })
        }).then(res=>{
            if(res.status===200){
                alert("Successfully posted!")
                //Reload our page
                loadMessages()
            }else{
                alert("We met something wrong when posting!")
            }
        })
    }

    
    const loadMessages = () => {
        fetch(`https://cs571api.cs.wisc.edu/rest/f24/hw6/messages?chatroom=${props.name}&page=${currentPage}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
            console.log(messages)
        })
    };
    

    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(()=>{
        loadCurrentUser(); 
        loadMessages(); 
    },[props,currentPage]);

    return <>
        <h1>{props.name} Chatroom</h1>
        {
            /* TODO: Allow an authenticated user to create a post. */
        }
        <form onSubmit={handlePost}>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="Chat_title" style={{ display: 'block' }}>
                    Post Title:
                </label>
                <input
                    id="Chat_title"
                    type="text"
                    ref={titleref} 
                    className="rounded-input"
                />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="Chat_content" style={{ display: 'block' }}>
                    Post Content:
                </label>
                <input
                    id="Chat_content"
                    type="text" // 隐藏PIN
                    ref={contentref} // Special bond together
                    className="rounded-input"
                />
            </div>
            <Button type="submit">Creat Post</Button>
        </form>
        <hr/>
        {
            messages.length > 0 ?
                <Row>
                    {
                        /* TODO: Complete displaying of messages. */
                        messages.map((message) =>(
                            <Col key={message.id} xs={12} md={6} lg={4}>
                                <BadgerMessage {...message} currentUser={currentUser} onDelete={handleDelete}/>
                            </Col>
                        ))
                    }
                </Row>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        }
        <Pagination>
            {
                [1,2,3,4].map((page)=>(
                    <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </Pagination.Item>
                ))
            }
        </Pagination>
    </>
}
