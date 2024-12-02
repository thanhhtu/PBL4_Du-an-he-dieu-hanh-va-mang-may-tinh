class AuthService {
    setExpiredItem(key, value, ttl) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl,
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    getExpiredItem(key) {
        const itemStr = localStorage.getItem(key);

        if (!itemStr) {
            return null;
        }

        const item = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }

        return item.value;
    }

    checkAuthToken() {
        const checkTokenExpiration = () => {
            const token = this.getExpiredItem('auth-token');
            if(token === null){
                const name = localStorage.getItem('name');
                if(name){
                    localStorage.removeItem('name');
                }
                window.location.replace('/');
            }
        }

        setInterval(checkTokenExpiration, Number(import.meta.env.VITE_EXPIRED_TOKEN));

        window.addEventListener('focus', checkTokenExpiration)
        window.addEventListener('online', checkTokenExpiration)
    }

    
}

export default new AuthService()
