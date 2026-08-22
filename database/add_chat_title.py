from sqlalchemy import text

from database.connection import engine


def add_chat_title():

    with engine.begin() as connection:

        connection.execute(
            text("""
                IF COL_LENGTH('chats', 'title') IS NULL
                BEGIN
                    ALTER TABLE chats
                    ADD title VARCHAR(250)
                    NOT NULL
                    CONSTRAINT DF_chats_title
                    DEFAULT 'New Chat'
                END
            """)
        )

    print("Chat title column added successfully.")


if __name__ == "__main__":
    add_chat_title()