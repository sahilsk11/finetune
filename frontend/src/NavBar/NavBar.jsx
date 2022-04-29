import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './navbar.css';
import logo2 from './logo2.png';
import bell from './bell.png';

Modal.setAppElement(document.getElementById('root'));


export function NavBar() {

	return (
		<div>
			<a href='/'><img className="imglogo" style={{ textAlign: "left", width: "10%", height: "auto", marginTop: "-2.5%" }} src={logo2} alt="Logo2" /></a>
			<section className="navigation">
				<div className="nav-container">
					<div class="brand">

					</div>
					<nav>
						<div className="nav-mobile"><a id="nav-toggle" href="#!"><span></span></a></div>
						<ul className="nav-list">
							<li>
								<a href={'/profile/' + localStorage.getItem("username")}>Profile</a>
							</li>
							<li>
								<a href="/search">Search</a>
							</li>
							<li>
								<a href="/settings">Settings</a>
							</li>
							<div className="dropdown">
								<div>
									<button className="dropbtn">
										Feed
									</button>
								</div>
								<div className="dropdown-content">
									<a href="/feed">My Feed</a>
									<a href="/trending-music">Trending Songs</a>
									<a href="/songs-by-genre">Posts by Genre</a>
									<a href="/saved-feed">Saved Posts</a>
									<a href="/liked-feed">Friend's Liked Songs</a>
								</div>
							</div>
							<li >
								<a style={{ background: "rgb(95, 17, 10)", color: "beige" }} href="/create-post">Create Post</a>
							</li>
							<li>
								<NotificationBell />
							</li>
						</ul>
					</nav>
				</div>
			</section>
		</div>
	)
}

function NotificationBell() {
	const [numUnread, updateNumUnread] = useState(0);
	const [modalIsOpen, setIsOpen] = useState(false);
	const [notifs, updateNotifs] = useState([]);


	useEffect(() => {
		fetch("http://localhost:5000/get_notification", {
			method: "GET",
			headers: {
				username: localStorage.getItem("username"),
				auth_token: localStorage.getItem("auth_token")
			},
		}).then(response => {
			if (response.status !== 200) {
				return null;
			}
			return response.json()
		}).then(data => {
			let x = [];
			let unread = 0;
			data.forEach(n => {
				if (!n.viewed) {
					unread++;
				}
				x.push(
					<Notification title={n.notification_type} subtitle={n.notification_content} isViewed={n.viewed} postId={n.notif_id} />
				)
			})
			updateNotifs(x);
			updateNumUnread(unread);
		})
	}, []);

	const markAsRead = (postId) => {
		fetch("http://localhost:5000/view_notification", {
			method: "POST",
			headers: {
				username: localStorage.getItem("username"),
				auth_token: localStorage.getItem("auth_token"),
				post_id: postId,
			},
		}).then(response => {
			if (response.status !== 200) {
				return null;
			}
			return response.json()
		}).then(data => {
			console.log(data);
		})
	}

	const markAllAsRead = () => {
		notifs.forEach(n => {
			console.log(n.props);
			markAsRead(n.props.postId);
		})
	}

	function closeModal() {
		console.log("here")
    setIsOpen(false);
  }

	useEffect(() => {
		console.log(modalIsOpen);
	}, [modalIsOpen])

	return (
		<a href="#" style={{ background: "rgba(0, 0, 0, 0)", position: "relative" }} onClick={() => setIsOpen(true)}>
			<img style={{ width: "25px", paddingTop: "18px" }} src={bell} />
			<UnreadCount count={numUnread} />
			<Modal
        isOpen={modalIsOpen}
        onAfterOpen={markAllAsRead}
        onRequestClose={closeModal}
        style={{
					top: '50%',
					left: '50%',
					right: 'auto',
					bottom: 'auto',
					marginRight: '-50%',
					transform: 'translate(-50%, -50%)',
					width: "50%",
				}}
        contentLabel="Example Modal"
      >
				<button onClick={closeModal}>close</button>
				{notifs}
			</Modal>
		</a>
	);
}

function Notification({title, subtitle, isViewed}) {
	let color = isViewed ?  "rgb(247 247 247)" :  "#d7d7d7";
	return (
		<div style={{
			backgroundColor: color,
			padding: "20px",
		}}>
			<h3>{title}</h3>
			<p>{subtitle}</p>
		</div>
	)
}

function UnreadCount({ count }) {
	if (count === 0) {
		return null;
	}

	return (
		<div style={{
			backgroundColor: "#ff0000a8",
			position: "absolute",
			top: "4px",
			right: "10px",
			borderRadius: "50%",
			width: "20px",
			height: "20px",
			padding: "0px",
			margin: "0px",
		}}>
			<span style={{
				margin: "0px",
				position: "absolute",
				top: "-18px",
				right: "6px",
				fontSize: "13px",
			}}>{count}</span>
		</div>
	)
}

export default NavBar;
