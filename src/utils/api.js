const BASE_URL = 'https://forum-api.dicoding.dev/v1';

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function setAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function setTokens({ accessToken, refreshToken }) {
  setAccessToken(accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
}

function removeTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

async function fetchWithAuth(url, options = {}) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(url, { ...options, headers });
  const responseJson = await response.json();
  if (responseJson.status === 'fail') {
    throw new Error(responseJson.message);
  }
  return responseJson.data;
}

const api = {
  async register({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const responseJson = await response.json();
    if (responseJson.status === 'fail') {
      throw new Error(responseJson.message);
    }
    return responseJson.data;
  },

  async login({ email, password }) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const responseJson = await response.json();
    if (responseJson.status === 'fail') {
      throw new Error(responseJson.message);
    }
    const { token, ...data } = responseJson.data;
    setTokens({ accessToken: token });
    return data;
  },

  async getOwnProfile() {
    return fetchWithAuth(`${BASE_URL}/users/me`);
  },

  async getUsers() {
    return fetchWithAuth(`${BASE_URL}/users`);
  },

  async getThreads() {
    return fetchWithAuth(`${BASE_URL}/threads`);
  },

  async getThreadDetail(id) {
    return fetchWithAuth(`${BASE_URL}/threads/${id}`);
  },

  async createThread({ title, body, category }) {
    return fetchWithAuth(`${BASE_URL}/threads`, {
      method: 'POST',
      body: JSON.stringify({ title, body, category }),
    });
  },

  async createComment({ threadId, content }) {
    return fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  async upVoteThread(threadId) {
    return fetchWithAuth(`${BASE_URL}/threads/${threadId}/up-vote`, {
      method: 'POST',
    });
  },

  async downVoteThread(threadId) {
    return fetchWithAuth(`${BASE_URL}/threads/${threadId}/down-vote`, {
      method: 'POST',
    });
  },

  async neutralizeVoteThread(threadId) {
    return fetchWithAuth(`${BASE_URL}/threads/${threadId}/neutral-vote`, {
      method: 'POST',
    });
  },

  async upVoteComment({ threadId, commentId }) {
    return fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
      { method: 'POST' },
    );
  },

  async downVoteComment({ threadId, commentId }) {
    return fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
      { method: 'POST' },
    );
  },

  async neutralizeVoteComment({ threadId, commentId }) {
    return fetchWithAuth(
      `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
      { method: 'POST' },
    );
  },

  async getLeaderboard() {
    return fetchWithAuth(`${BASE_URL}/leaderboards`);
  },

  async refreshToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');
    const response = await fetch(`${BASE_URL}/authentications`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const responseJson = await response.json();
    if (responseJson.status === 'fail') {
      throw new Error(responseJson.message);
    }
    setAccessToken(responseJson.data.accessToken);
    return responseJson.data;
  },

  async logout() {
    const refreshToken = getRefreshToken();
    try {
      await fetch(`${BASE_URL}/authentications`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // ignore
    } finally {
      removeTokens();
    }
  },
};

export {
  api,
  getAccessToken,
  setAccessToken,
  removeTokens,
  setTokens,
};
