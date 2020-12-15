import React from 'react';
import UserInfo from './UserInfo';
import Public from './Public';
import netlifyIdentity from 'netlify-identity-widget';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';


function AuthExample() {
  return (
    <Router>
      <div className="container">
        <Login />
        <ul>
          <li>
            <Link to="/public">Public Page</Link>
          </li>
          <li>
            <Link to="/userinfo">UserInfo Page</Link>
          </li>
        </ul>
        <Route path="/public" component={Public} />
        <Route path="/unauthorized" component={UnauthorizedPage} />
        <PrivateRoute path="/userinfo" component={UserInfo} />
      </div>
    </Router>
  );
}

const netlifyAuth = {
  isAuthenticated() {
    return !!netlifyIdentity.currentUser()
  },
  user: null,
  authenticate(callback) {
    netlifyIdentity.open();
    netlifyIdentity.on('login', user => {
      this.user = user;
      callback(user);
      netlifyIdentity.close();
    });
  },
  signout(callback) {
    netlifyIdentity.logout();
    netlifyIdentity.on('logout', () => {
      this.user = null;
      callback();
    });
  }
};

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        netlifyAuth.isAuthenticated() ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/unauthorized',
              }}
            />
          )
      }
    />
  );
}

const UnauthorizedPage = () => (
  <div className="container">
    <h3>Log in to see this page</h3>
  </div>
)
class Login extends React.Component {
  state = { loggedIn: netlifyAuth.isAuthenticated() };

  login = () => {
    netlifyAuth.authenticate(() => {
      this.setState({ loggedIn: netlifyAuth.isAuthenticated() });
    });
  };

  logout = () => {
    netlifyAuth.signout(() => {
      this.setState({ loggedIn: netlifyAuth.isAuthenticated() });
    });
  };

  render() {
    let { loggedIn } = this.state;
    console.log("Logged in:", loggedIn)
    if (loggedIn) {
      const user = netlifyIdentity.currentUser();
      return <div className="container">
        <p> Logged in as {user.email} </p>
        <button onClick={this.logout}>Log Out</button>
      </div>
    } else {
      return (
        <div className="container">
          <p>You are not logged in</p>
          <button onClick={this.login}>Log in</button>
        </div>
      );
    }

  }
}
export default AuthExample;
