import Api from "./Api";
import history from "./history";


class Auth {
  constructor() {
    this.authenticated = false;
  }

  register = async (username, email, password) => {
    try {
      await Api.register(username, email, password)
      this.login(username, password)
    } catch (error) {
      console.log(error)
    }
  }

  login = async (username, password) => {
    const response = await Api.login(username, password);
    const user = response.data.data;
    console.log(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  refreshToken = async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const updatedUser = {...currentUser,
      token: Api.refreshToken(currentUser.refresh),
    }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }

  logout = () => {
    console.log('logout')
    localStorage.removeItem('currentUser');
    history.push("/login")
  }

  isAuthenticated = () => {
    console.log('checking auth')
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('currentUser', currentUser)
    if (currentUser) {
      console.log('returning true')
      return true;
    } else {
      return false;
    }
  }
}

export default new Auth();