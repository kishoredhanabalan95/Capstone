import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

class LoginPage extends React.Component {

    constructor() {
        super();

        this.state = {
            username: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password } = this.state;
        if (username && password) {
            this.login(username, password);
        }
    }

    login(username, password) {

        fetch("http://localhost:8080/api/user?userid=" + username + "&password=" + password, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            const MySwal = withReactContent(Swal)
            console.log('Success:', data);
            if (!!data && !!data.userid) {
                MySwal.fire({
                    title: <strong>Login Successful</strong>,
                    html: <i>You will be redirected to socket.io chat-box</i>,
                    icon: 'success'
                }).then(() => {
                    window.sessionStorage.setItem('userid', data.userid);
                    window.sessionStorage.setItem('name', data.name);
                    let currLoc = window.location.href;
                    // currLoc = currLoc.substring(0, currLoc.length - 5);
                    window.location.href = currLoc + 'home';
                })
            } else {
                MySwal.fire({
                    title: <strong>Login Failed</strong>,
                    html: <i>{ data.message }!</i>,
                    icon: 'error'
                })
            }
        })
        .catch((error) => {
            const MySwal = withReactContent(Swal)
            MySwal.fire({
                title: <strong>Login Failed</strong>,
                html: <i>Invalid data!</i>,
                icon: 'error'
            })
        });

    }

    render() {
        const { username, password, submitted } = this.state;
        return (
            <div className="col-8 offset-2">
                <h2>Login</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                        {submitted && !username &&
                            <div className="help-block">Username is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Login</button>
                        <Link to="/register" className="btn btn-link">Register</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default LoginPage;
