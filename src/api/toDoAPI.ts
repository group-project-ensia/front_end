// src/api/todoApi.ts
const BASE = 'http://127.0.0.1:5000/api/todos';

async function handleResponse(res: Response) {
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  return res.json();
}

export function getTodosByUser(userId: string) {
  return fetch(`${BASE}/${userId}`)
    .then(handleResponse);
}

export function getDoneTodos(userId: string) {
  return fetch(`${BASE}/${userId}/done`)
    .then(handleResponse);
}

export function getDoingTodos(userId: string) {
  return fetch(`${BASE}/${userId}/doing`)
    .then(handleResponse);
}

export function getTodosForCalendar(userId: string) {
  return fetch(`${BASE}/calendar/${userId}`)
    .then(handleResponse);
}

export function createTodo(todo: { title: string; dueDate: string; userId: string; }) {
  return fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  })
  .then(handleResponse);
}

export function updateTodo(id: string, updates: any) {
  return fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  .then(handleResponse);
}

export function deleteTodo(id: string) {
  return fetch(`${BASE}/${id}`, { method: 'DELETE' })
    .then(handleResponse);
}
