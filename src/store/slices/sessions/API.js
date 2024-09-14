import { createAsyncThunk } from "@reduxjs/toolkit";

const server = {
  host: "localhost", // 192.168.10.67
  port: 8080,
};

function makeUrl(host, port, path) {
  const domain = `${host}:${port}`;
  return `http://${domain}/${path}`;
}

export const getFetchSessions = createAsyncThunk(
  "sessions/getFetchSessions",
  async () => {
    const result = await fetch(makeUrl(server.host, server.port, "sessions"));
    return result.json();
  }
);

export const addSession = createAsyncThunk(
  "sessions/addSession",
  async (session) => {
    const result = await fetch(makeUrl(server.host, server.port, "sessions"), {
      method: "POST",
      body: JSON.stringify(session),
    });
    const json = await result.json();
    return json;
  }
);

//filter example
// http://localhost:8080/users?userInfo.country=USA
export const getFetchSessionByToken = createAsyncThunk(
  "sessions/getFetchSessionByToken",
  async (token) => {
    const result = await fetch(
      makeUrl(server.host, server.port, `/sessions?token=${token}`)
    );
    return result.json();
  }
);

export const deleteSessionById = createAsyncThunk(
  "sessions/deleteSessionById",
  async (id) => {
    const result = await fetch(
      makeUrl(server.host, server.port, `/sessions/${id}`),
      {
        method: "DELETE",
      }
    );
    return result;
  }
);

// export const editUser = createAsyncThunk("users/editUser", async (id, payload)=>{
//     const result = await fetch(makeUrl(server.host, server.port, `/users/${id}`), {
//         method: "PATCH",
//         body: JSON.stringify(payload)
//     })
//     return result;
// })
