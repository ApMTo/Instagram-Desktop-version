const server = {
  host: "localhost",
  port: 8080,
};

function makeUrl(host, port, path) {
  const domain = `${host}:${port}`;
  return `http://${domain}/${path}`;
}

export const getUserById = async (id) => {
  const result = await fetch(makeUrl(server.host, server.port, `users/${id}`));

  return result.json();
};

export const getPostById = async (id) => {
  const result = await fetch(makeUrl(server.host, server.port, `posts/${id}`));
  return result.json();
};

export const createNewAccount = async (user) => {
  await fetch(makeUrl(server.host, server.port, `users`), {
    method: "POST",
    body: JSON.stringify(user),
  });
};

export const addFetchPost = async (post) => {
  await fetch(makeUrl(server.host, server.port, `posts`), {
    method: "POST",
    body: JSON.stringify(post),
  });
};

export const getUserWithName = async (userName) => {
  const request = await fetch(
    makeUrl(server.host, server.port, `users?userName=${userName}`)
  );
  return request.json();
};

export const getPosts = async () => {
  const request = await fetch(makeUrl(server.host, server.port, `posts`));
  return request.json()
};

export const createChat = async (chat) => {
  await fetch(makeUrl(server.host, server.port, `chats`), {
    method: 'POST',
    body: JSON.stringify(chat)
  });
 
};

export const editChat = async (id, chatInfo) => {
  
    await fetch(makeUrl(server.host, server.port, `chats/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatInfo),
    });
  console.log(chatInfo);
};

export const addLikeInPost = async (id, body) => {
  await fetch(makeUrl(server.host, server.port, `posts/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(body)
  });
 
};

export const updateUserById = async (id, body) => {
  await fetch(makeUrl(server.host, server.port, `users/${id}`), {
    method: 'PATCH',
    body: JSON.stringify(body)
  })
}