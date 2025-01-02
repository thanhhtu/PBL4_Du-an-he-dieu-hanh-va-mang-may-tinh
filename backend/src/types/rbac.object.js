export const Role = {
    ADMIN: 'admin',
    USER: 'user'
};

export const Permission = {
    //USERS
    //admin
    VIEW_ALL_USERS: 'viewAllUsers', //user has role user (not admin)
    DELETE_USER: 'deleteUser',
    //user
    VIEW_USER: 'viewUser',
    EDIT_USER: 'editUser',

    //PRODUCTS
    //all - VIEW_ALL_PRODUCTS
    //admin
    ADD_PRODUCT: 'addProduct',
    EDIT_PRODUCT: 'editProduct',
    DELETE_PRODUCT: 'deleteProduct',

    //REVIEWS
    //all - VIEW_ALL_REVIEWS
    //user
    ADD_REVIEW: 'addReview',
    EDIT_REVIEW: 'editReview',
    DELETE_REVIEW: 'deleteReview',

    //CARTS -> 1 product + 1 user = 1 cart
    //user
    VIEW_CART: 'viewCart',
    ADD_TO_CART: 'addToCart',
    EDIT_CART: 'editCart',
    REMOVE_FROM_CART: 'removeFromCart',

    //SHIPPING
    //user
    VIEW_SHIPPING: 'viewShipping',
    ADD_SHIPPING: 'addShipping',
    EDIT_SHIPPING: 'editShipping',
    DELETE_SHIPPING: 'deleteShipping',
    CHANGE_DEFAULT_SHIPPING: 'changeDefaultShipping',

    //ORDER
    //user
    VIEW_ORDER: 'viewOrder',
    ADD_ORDER: 'addOrder'
};