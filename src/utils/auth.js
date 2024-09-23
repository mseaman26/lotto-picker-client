import {jwtDecode} from 'jwt-decode';
import { json } from 'react-router-dom';

class AuthService {
  getProfile() {
    const tokens = this.getToken();
    if (!tokens?.accessToken) {
      return null;
    }
    return jwtDecode(this.getToken().accessToken);
  }

  loggedIn() {
    const token = this.getToken();
    // If there is a token and it's not expired, return `true`
    return token && !this.isTokenExpired(token) ? true : false;
  }

  isTokenExpired(token) {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem('id_token');
      return true;
    }
    return false;
  }

  getToken() {
    const accessToken =  JSON.parse(localStorage.getItem('accessToken'));
    const refreshToken =  JSON.parse(localStorage.getItem('refreshToken'));
    if (!accessToken || !refreshToken) {
      return null;
    }
    return {
      accessToken,
      refreshToken
    }

  }

  login(accessToken, refreshToken) {
    localStorage.setItem('accessToken', JSON.stringify(accessToken));
    localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // window.location.reload();
  }
}

export default new AuthService();
