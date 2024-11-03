import {CreateMrList} from "./CreateMrList";
import {User} from "./User";

const load = async () => {
    await User.setUiUserInfo();
    await CreateMrList.createCard();
}

load();