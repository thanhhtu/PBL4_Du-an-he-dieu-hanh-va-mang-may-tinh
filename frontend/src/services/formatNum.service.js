export const formattedPrice = (price) => {
    const newPrice = price;
    return new Intl.NumberFormat('vi-VN').format(newPrice);
}