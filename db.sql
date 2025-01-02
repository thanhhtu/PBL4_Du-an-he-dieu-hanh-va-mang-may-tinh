USE ECOMMERCE;

CREATE TABLE user (
	UserId INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	FullName VARCHAR(300) CHARACTER SET UTF8 COLLATE UTF8_UNICODE_CI NOT NULL,
	Email VARCHAR(300) NOT NULL,
	Password VARCHAR(300) NOT NULL,
	CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PasswordResetToken VARCHAR(255),
	PasswordResetExpiration VARCHAR(255),
	PasswordLastResetDate DATETIME
);

INSERT INTO user (FullName, Email, Password) VALUES ("admin", "admin@gmail.com", "$2a$12$OsGXapwWeo.rT/T3EMjxduFsy7Jrik8Ww64azaWpib3EPJwERkBmW");
INSERT INTO user (FullName, Email, Password) VALUES 
("John Doe", "john.doe@example.com", "$2a$12$OsGXapwWeo.rT/T3EMjxduFsy7Jrik8Ww64azaWpib3EPJwERkBmW"),
("Jane Smith", "jane.smith@example.com", "$2a$12$OsGXapwWeo.rT/T3EMjxduFsy7Jrik8Ww64azaWpib3EPJwERkBmW"),
("Alice Johnson", "alice.johnson@example.com", "$2a$12$OsGXapwWeo.rT/T3EMjxduFsy7Jrik8Ww64azaWpib3EPJwERkBmW"),
("Bob Brown", "bob.brown@example.com", "$2a$12$OsGXapwWeo.rT/T3EMjxduFsy7Jrik8Ww64azaWpib3EPJwERkBmW"),
("Charlie Davis", "charlie.davis@example.com", "$2a$12$OsGXapwWeo.rT/T3EMjxduFsy7Jrik8Ww64azaWpib3EPJwERkBmW");

CREATE TABLE role (
	RoleId INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	RoleName VARCHAR(255) NOT NULL
);

INSERT INTO role (RoleName) VALUES ("admin");
INSERT INTO role (RoleName) VALUES ("user");

CREATE TABLE user_role (
	UserId INT NOT NULL,
	FOREIGN KEY(UserId) REFERENCES user(UserId) ON DELETE CASCADE,
	RoleId INT NOT NULL,
	FOREIGN KEY(RoleId) REFERENCES role(RoleId) ON DELETE CASCADE
);

INSERT INTO user_role (UserId, RoleId) VALUES (1, 1);
INSERT INTO user_role (UserId, RoleId) VALUES (2, 2);
INSERT INTO user_role (UserId, RoleId) VALUES (3, 2);
INSERT INTO user_role (UserId, RoleId) VALUES (4, 2);
INSERT INTO user_role (UserId, RoleId) VALUES (5, 2);
INSERT INTO user_role (UserId, RoleId) VALUES (6, 2);

CREATE TABLE permission (
	PermissionId INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	PermissionName VARCHAR(255) NOT NULL
);

CREATE TABLE role_permission (
	RoleId INT NOT NULL,
	FOREIGN KEY(RoleId) REFERENCES Role(RoleId) ON DELETE CASCADE,
	PermissionId INT NOT NULL,
	FOREIGN KEY(PermissionId) REFERENCES permission(PermissionId) ON DELETE CASCADE
);

INSERT INTO permission (PermissionName) VALUES ('viewAllUsers');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (1, 1);
INSERT INTO permission (PermissionName) VALUES ('deleteUser');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (1, 2);
INSERT INTO permission (PermissionName) VALUES ('viewUser');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 3);
INSERT INTO permission (PermissionName) VALUES ('editUser');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 4);

INSERT INTO permission (PermissionName) VALUES ('addProduct');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (1, 5);
INSERT INTO permission (PermissionName) VALUES ('editProduct');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (1, 6);
INSERT INTO permission (PermissionName) VALUES ('deleteProduct');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (1, 7);

INSERT INTO permission (PermissionName) VALUES ('addReview');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 8);
INSERT INTO permission (PermissionName) VALUES ('editReview');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 9);
INSERT INTO permission (PermissionName) VALUES ('deleteReview');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 10);

INSERT INTO permission (PermissionName) VALUES ('viewCart');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 11);
INSERT INTO permission (PermissionName) VALUES ('addToCart');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 12);
INSERT INTO permission (PermissionName) VALUES ('editCart');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 13);
INSERT INTO permission (PermissionName) VALUES ('removeFromCart');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 14);

INSERT INTO permission (PermissionName) VALUES ('viewShipping');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 15);
INSERT INTO permission (PermissionName) VALUES ('addShipping');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 16);
INSERT INTO permission (PermissionName) VALUES ('editShipping');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 17);
INSERT INTO permission (PermissionName) VALUES ('deleteShipping');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 18);
INSERT INTO permission (PermissionName) VALUES ('changeDefaultShipping');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 19);

INSERT INTO permission (PermissionName) VALUES ('viewOrder');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 20);
INSERT INTO permission (PermissionName) VALUES ('addOrder');
INSERT INTO role_permission (RoleId, PermissionId) VALUES (2, 21);

CREATE TABLE product (
	ProductId INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	ProductName VARCHAR(300) CHARACTER SET UTF8 COLLATE UTF8_UNICODE_CI NOT NULL,
	Description VARCHAR(300) CHARACTER SET UTF8 COLLATE UTF8_UNICODE_CI NOT NULL,
	Price DECIMAL(10, 2) NOT NULL,
	Quantity INT NOT NULL,
	ImageUrl VARCHAR(300) NOT NULL,
	ImagePublicId VARCHAR(300) NOT NULL,
	CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO product (ProductName, Description, Price, Quantity, ImageUrl, ImagePublicId) VALUES 
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 200, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733150019/product_1_j2s8u2.png", "product_1_j2s8u2"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 200, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733150019/product_2_l93udf.png", "product_2_l93udf"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 200, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733150020/product_3_zhp97n.png", "product_3_zhp97n"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 200, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733150020/product_4_mo2idd.png", "product_4_mo2idd"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 200, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733150019/product_5_sqieko.png", "product_5_sqieko"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 200, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733150020/product_6_pf6x8a.png", "product_6_pf6x8a"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 200, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733150020/product_7_esknfw.png", "product_7_esknfw"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 200, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733150019/product_8_k0vufx.png", "product_8_k0vufx"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 200, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733150021/product_9_in4yh0.png", "product_9_in4yh0"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 200, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733150021/product_10_t5qbli.png", "product_10_t5qbli"),

("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 300, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205138/product_11_urpx0e.png", "product_11_urpx0e"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 300, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205139/product_12_cb9pdw.png", "product_12_cb9pdw"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 300, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205138/product_13_qjixcj.png", "product_13_qjixcj"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 300, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205139/product_14_oncudi.png", "product_14_oncudi"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 300, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205139/product_15_sd40y3.png", "product_15_sd40y3"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 300, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205139/product_16_dbyxyr.png", "product_16_dbyxyr"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 300, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733497577/product_17_io6z7w.png", "product_17_io6z7w"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 300, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205138/product_18_jddrsy.png", "product_18_jddrsy"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 300, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205138/product_19_i3cqtr.png", "product_19_i3cqtr"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 300, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205138/product_20_gudp0c.png", "product_20_gudp0c"),

("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 500, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205401/product_21_cembvz.png", "product_21_cembvz"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 500, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205401/product_22_dgprqw.png", "product_22_dgprqw"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 500, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205401/product_23_emymka.png", "product_23_emymka"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 500, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205401/product_24_ajqauj.png", "product_24_ajqauj"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 500, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205402/product_25_wnhac4.png", "product_25_wnhac4"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 500, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205402/product_26_y0wjpc.png", "product_26_y0wjpc"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 500, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205402/product_27_xx60ud.png", "product_27_xx60ud"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 500, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205402/product_28_lpucah.png", "product_28_lpucah"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 500, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205401/product_29_ygeram.png", "product_29_ygeram"),
("Striped Flutter Blouse", "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse", 500000, 500, "https://res.cloudinary.com/dwxl8fguu/image/upload/v1733205401/product_30_cwqz4y.png", "product_30_cwqz4y");

CREATE TABLE cart (
	CartId INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	UserId INT NOT NULL,
	FOREIGN KEY(UserId) REFERENCES user(UserId) ON DELETE CASCADE,
	ProductId INT NOT NULL,
	FOREIGN KEY(ProductId) REFERENCES product(ProductId) ON DELETE CASCADE,
	Quantity INT DEFAULT 0
);

CREATE TABLE review (
	ReviewId INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	UserId INT NOT NULL,
	FOREIGN KEY(UserId) REFERENCES user(UserId) ON DELETE CASCADE,
	ProductId INT NOT NULL,
	FOREIGN KEY(ProductId) REFERENCES product(ProductId) ON DELETE CASCADE,
	Rating INT NOT NULL,
	Content VARCHAR(300) CHARACTER SET UTF8 COLLATE UTF8_UNICODE_CI NOT NULL,
	CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO review (UserId, ProductId, Rating, Content) VALUES 
(2, 1, 5, "Great product! Exceeded my expectations."),
(3, 1, 4, "Good quality, but shipping was a bit slow"),
(4, 1, 5, "Great product! Exceeded my expectations."),
(5, 1, 5, "Great product! Exceeded my expectations."),
(2, 2, 5, "Great product! Exceeded my expectations."),
(3, 2, 5, "Great product! Exceeded my expectations."),
(4, 2, 5, "Great product! Exceeded my expectations.");

CREATE TABLE shipping(
	ShippingId INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	UserId INT NOT NULL,
	FOREIGN KEY(UserId) REFERENCES user(UserId) ON DELETE CASCADE,
	Name VARCHAR(255) NOT NULL,
	PhoneNumber VARCHAR(255) NOT NULL,
	Address VARCHAR(255) NOT NULL,
	IsDefault BIT NOT NULL
);

INSERT INTO shipping (UserId, Name, PhoneNumber, Address, IsDefault) VALUES 
(2, "John Doe", "0123456789", "123 Au Co, Liên Chieu, Da Nang", 1),
(3, "Jane Smith", "0987654321", "123 Au Co, Liên Chieu, Da Nang", 1),
(4, "Alice Johnson", "0123654789", "123 Au Co, Liên Chieu, Da Nang", 1),
(5, "Bob Brown", "0321456987", "123 Au Co, Liên Chieu, Da Nang", 1),
(6, "Charlie Davis", "0147852369", "123 Au Co, Liên Chieu, Da Nang", 1);

CREATE TABLE purchase_order(
	OrderId INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	UserId INT NOT NULL,
	FOREIGN KEY(UserId) REFERENCES user(UserId) ON DELETE CASCADE,
	ShippingId INT NOT NULL,
	FOREIGN KEY(ShippingId) REFERENCES shipping(ShippingId) ON DELETE CASCADE,
	TotalPrice DECIMAL(10, 2) NOT NULL,
	PaymentMethod VARCHAR(255) NOT NULL,
	CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE order_product(
	OrderProductId INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	OrderId INT NOT NULL,
	FOREIGN KEY(OrderId) REFERENCES purchase_order(OrderId) ON DELETE CASCADE,
	ProductId INT NOT NULL,
	FOREIGN KEY(ProductId) REFERENCES product(ProductId) ON DELETE CASCADE,
	Quantity INT NOT NULL,
	PriceAtOrder DECIMAL(10, 2) NOT NULL
);