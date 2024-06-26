import { useContext } from 'react';
import { UserContext } from '../../context/user.context';
import styles from './SelectUser.module.css';

// eslint-disable-next-line react/prop-types
function SelectUser() {
    const { userId, setUserId } = useContext(UserContext);

    const changeUser = (e) => {
        setUserId(Number(e.target.value));
    };

    return (
        <select
            className={styles['user_select']}
            name="user"
            id="user"
            onChange={changeUser}
            value={userId}
        >
            <option value="1">James</option>
            <option value="2">Liam</option>
        </select>
    );
}

export default SelectUser;
