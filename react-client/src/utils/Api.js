import axios from "axios";

class Api {
  savePrediction = async (picture, _id, token) => {
    try {
      console.log(picture);
      const response = await axios({method:'POST', url:`/api/user/${_id}/predictions`, data: {picture}, headers: { Authorization: `Bearer ${token}` }});
      console.log(response);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  register = async (username, email, password) => {
    try {
      const response = await axios.post("/api/user/register", { username, email, password });
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  login = async (username, password) => {
    try {
      const response = await axios.post("/api/user/login", { username, password });
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  refreshToken = async (refreshToken) => {
    try {
      const response = await axios.post("/api/user/refresh", { headers: { Authorization: `Bearer ${refreshToken}` } });
      const refreshedToken = response.data.token
      return refreshedToken;
    } catch (error) {
      
    }
  }

  authed = async (token) => {
    try {
      const response = await axios.get("/api/user/authed", { headers: { Authorization: `Bearer ${token}` } });
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};

export default new Api();

