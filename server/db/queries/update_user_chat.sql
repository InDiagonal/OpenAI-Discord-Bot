UPDATE chats
SET chat = chat || ?
WHERE user_id = ?