/**
 * 缓存 工具类
 */
var Storage = {
    // ============== SessionStorage 设置缓存 ================
    // 设置缓存
    setSession: (name, data) => {
        sessionStorage.removeItem(name)
        sessionStorage.setItem(name, JSON.stringify(data))
    },
    // 获取缓存
    getSession: (name) => {
        return JSON.parse(sessionStorage.getItem(name));
    },
    // 删除缓存
    removeSession: (name) => {
        sessionStorage.removeItem(name)
    },
    //=================== localStorage 设置缓存 =====================
    // 设置缓存
    setLocal: (name, data) => {
        localStorage.removeItem(name)
        localStorage.setItem(name, JSON.stringify(data))
    },
    // 获取缓存
    getSession: (name) => {
        return JSON.parse(localStorage.getItem(name));
    },
    // 删除缓存
    removeSession: (name) => {
        localStorage.removeItem(name)
    },
}

export default Storage;