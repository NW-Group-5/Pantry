USE pantryDB;

INSERT INTO UserAccounts (UserName, Password, createdAt, updatedAt) VALUES ("test_user", "test_password",current_date(), current_date());

INSERT INTO Ingredients (name, aisle, UserAccountId, createdAt, updatedAt) VALUES ("pineapples", "Produce", "1", current_date(), current_date());