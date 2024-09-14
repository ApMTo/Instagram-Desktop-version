import { createAsyncThunk } from "@reduxjs/toolkit";

const server = {
  host: "localhost", // 192.168.10.67
  port: 8080,
};

function makeUrl(host, port, path) {
  const domain = `${host}:${port}`;
  return `http://${domain}/${path}`;
}

export const ErrorCode = {
  LOGIN_FAILURE_INVALID_USERNAME: 0,
  LOGIN_FAILURE_INVALID_PASSWORD: 1,
  REGISTRATION_FAILURE_USERNAME_EXISTS: 2,
};

export const getFetchUsers = createAsyncThunk(
  "users/getFetchUsers",
  async () => {
    const result = await fetch(makeUrl(server.host, server.port, "users"));
    return result.json();
  }
);

export const getFetchPosts = createAsyncThunk(
  "users/getFetchPosts",
  async () => {
    const result = await fetch(makeUrl(server.host, server.port, "posts"));
    return result.json();
  }
);

export const getFetchUserById = createAsyncThunk(
  "users/getFetchUserById",
  async (id) => {
    const result = await fetch(
      makeUrl(server.host, server.port, `users/${id}`)
    );
    return result.json();
  }
);

export const getFetchPostById = createAsyncThunk(
  "users/getFetchPostById",
  async (id) => {
    const result = await fetch(
      makeUrl(server.host, server.port, `posts/${id}`)
    );
    return result.json();
  }
);

export const deleteUserById = createAsyncThunk(
  "users/deleteUserById",
  async (id) => {
    const result = await fetch(
      makeUrl(server.host, server.port, `users/${id}`),
      {
        method: "DELETE",
      }
    );
    return result;
  }
);

export const getFetchUserByUsername = async (username) => {
  const result = await fetch(
    makeUrl(server.host, server.port, `users?userName=${username}`)
  );
  const data = await result.json();
    if (data.length == 0) {
      return {}
    }
    return data[0]
}

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ username, password }) => {
    const result = await fetch(
      makeUrl(server.host, server.port, `users?userName=${username}`)
    );
    const data = await result.json();
    if (data.length == 0) {
      throw new Error(ErrorCode.LOGIN_FAILURE_INVALID_USERNAME);
    }
    const users = data.filter((u) => u.password === password);
    if (users.length > 0) {
      const user = users[0];
      return user;
    } else {
      throw new Error(ErrorCode.LOGIN_FAILURE_INVALID_PASSWORD);
    }
  }
);

export const registerUser = createAsyncThunk("user/registerUser", async (user) => {
  debugger
  const result_exists = await fetch(
    makeUrl(server.host, server.port, `users?userName=${user.userName}`)
  );
  const data_exists = await result_exists.json();
  debugger
  if (data_exists.length > 0) {
    throw new Error(ErrorCode.REGISTRATION_FAILURE_USERNAME_EXISTS);
  }
  await fetch(makeUrl(server.host, server.port, `users`), {
    method: "POST",
    body: JSON.stringify(user),
  });
  const userWithId = await fetch(
    makeUrl(server.host, server.port, `users?userName=${user.userName}`)
  );
  return userWithId.json();
});

export const editUser = createAsyncThunk(
  "users/editUser",
  async (id, payload) => {
    const result = await fetch(
      makeUrl(server.host, server.port, `users/${id}`),
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
    return result;
  }
);

export const getFetchChats = createAsyncThunk(
  "users/getFetchChats",
  async () => {
    const result = await fetch(makeUrl(server.host, server.port, "chats"));
    return result.json();
  }
);
