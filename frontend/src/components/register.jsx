import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

class RegisterPage extends React.Component {
    constructor() {
        super();

        this.state = {
            name: '',
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
        const { name, username, password } = this.state;
        if (name && username && password) {
            this.register(name, username, password);
        }
    }

    register(name, username, password) {
        fetch("http://localhost:8080/api/user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                name: name,
                userid: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            const MySwal = withReactContent(Swal)
            console.log('Success:', data);
            if (!!data && !!data.success) {
                MySwal.fire({
                    title: <strong>Registration Successful</strong>,
                    html: <i>You will be redirected to Login Page</i>,
                    icon: 'success'
                }).then(() => {
                    let currLoc = window.location.href;
                    currLoc = currLoc.substring(0, currLoc.length - 9);
                    window.location.href = currLoc;
                })
            } else {
                MySwal.fire({
                    title: <strong>Registration Failed</strong>,
                    html: <i>{ data.message }!</i>,
                    icon: 'error'
                })
            }
        })
        .catch((error) => {
            const MySwal = withReactContent(Swal)
            MySwal.fire({
                title: <strong>Registration Failed</strong>,
                html: <i>Invalid data!</i>,
                icon: 'error'
            })
        });
    }

    render() {
        const { name, username, password, submitted } = this.state;
        return (
            <div className="col-8 offset-2">
                <h2>Register</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !name ? ' has-error' : '')}>
                        <label htmlFor="name">Name</label>
                        <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} />
                        {submitted && !name &&
                            <div className="help-block">Name is required</div>
                        }
                    </div>
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
                        <button className="btn btn-primary">Register</button>  
                        Already Registered? Click<Link to="/" className="btn btn-link">here</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default RegisterPage;
