import React, { useState } from 'react';
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { useAlert } from "react-alert";
import "./login.css";

const Login = () => {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const loginHandler = (e) => {
		e.preventDefault();
	};

	return (
		<div className="login">
			<form onSubmit={loginHandler} className="loginForm">
				<Typography variant="h3" style={{ padding: "2vmax" }}>
					SocMedia
				</Typography>
				<input
					type="email"
					placeholder="Email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Link to="/forgot/password">
					<Typography>Forgot Password?</Typography>
				</Link>
				<Button type="submit">Login</Button>
				<Link to="/register">
					<Typography>Don't have an account?</Typography>
				</Link>
			</form>
		</div>
	);
};

export default Login;