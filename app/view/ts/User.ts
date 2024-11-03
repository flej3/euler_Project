export class User {
    static getUserInfo = async () => {
        try{
            const user = await fetch(`/userInfo`, {
                method: 'GET',
            });
            const userInfo = await user.json();
            return userInfo;
        }catch(err){
            console.error(err);
        }
    }

    static setUiUserInfo = async () => {
        try{
            const user = await this.getUserInfo();
            const userInfoDiv = document.getElementById('userInfo');
            const loginBtn = document.getElementById('login');
            const logoutBtn = document.getElementById('logout');
            if(user.success){
                if(loginBtn){
                    loginBtn.remove();
                }
                const userInfo = user.userInfo;
                userInfoDiv!.innerHTML = `
                    <span>${userInfo.name}님 어서오세요.</span>
                    <a id="logout" href="/logout" class="btn btn-outline-primary me-2">Logout</a>
                `;
            } else {
                if(logoutBtn){
                    logoutBtn.remove();
                }
                userInfoDiv!.innerHTML = `
                    <a id="login" href="/auth/gitlab" class="btn btn-outline-primary me-2">Login</a>
                `;
            }
        }catch(err){
            console.error(err);
        }
    }
}