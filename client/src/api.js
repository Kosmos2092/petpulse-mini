// Одна функция для всех запросов к серверу.
// Если сервер ответил ошибкой — выбрасываем её с текстом от сервера, чтобы показать пользователю.
export async function request(method, url, body) {
    const response = await fetch("/api" + url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : {},
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}
