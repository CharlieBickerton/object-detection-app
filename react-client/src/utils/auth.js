import Api from "./Api";


class Auth {
  constructor() {
    this.authenticated = false;
  }

  register = async (username, email, password) => {
    try {
      await Api.register(username, email, password)
      this.login(username, email, password)
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
    const currentUser = localStorage.getItem('currentUser');
    const updatedUser = {...currentUser,
      token: Api.refreshToken(currentUser.refresh),
    }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }

  logout = () => {
    localStorage.removeItem('currentUser');
  }

  isAuthenticated = async () => {
    const currentUser = localStorage.getItem('currentUser');
    const response = Api.authed(currentUser.token);
    console.log(response)
    if (response.status == 200 ) {
      return true;
    } else {
      return false;
    }
  }
}

export default new Auth();