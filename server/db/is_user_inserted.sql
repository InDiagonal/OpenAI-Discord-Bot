SELECT EXISTS(
    SELECT 1
    FROM chats
    WHERE user_id = ?
) AS foo