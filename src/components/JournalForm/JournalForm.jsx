import Button from '../Button/Button';
import styles from './JournalForm.module.css';
import { useState, useEffect, useReducer, useRef, useContext } from 'react';
import { INITIAL_STATE, formReducer } from './JournalForm.state';
import { UserContext } from '../../context/user.context';

//eslint-disable-next-line react/prop-types
// onSubmit функция, которая получает данные из формы и добавляет их в новый элемент addItem
function JournalForm({ onSubmit }) {
    const [formState, dispatchForm] = useReducer(formReducer, INITIAL_STATE);
    const { isValid, isFormReadyToSubmit, values } = formState;
    // useRef, используем для постановки фокуса на невалидное поле
    const titleRef = useRef();
    const dateRef = useRef();
    const postRef = useRef();
    const { userId } = useContext(UserContext);

    // функция, которая ставит курсор на незаполненное поле
    const focusError = (isValid) => {
        switch (true) {
            case !isValid.title:
                titleRef.current.focus();
                break;
            case !isValid.date:
                dateRef.current.focus();
                break;
            case !isValid.post:
                postRef.current.focus();
                break;
        }
    };

    // очистка формы, после показа красным цветом строчек, которые не заполнены
    useEffect(() => {
        let timerId;
        if (!isValid.title || !isValid.post || !isValid.date) {
            timerId = setTimeout(() => {
                focusError(isValid);
                console.log('Cleared');
                // из js файла, где прописан switch
                dispatchForm({ type: 'RESET_VALIDITY' });
            }, 2000);
        }

        // с помощью этой строчки мы блокируем возможность несколько раз запускать setTimeout, благдаря этому ошибок не возникает
        return () => {
            clearTimeout(timerId);
        };
    }, [isValid]);

    // проверка на валидность
    useEffect(() => {
        if (isFormReadyToSubmit) {
            onSubmit(values);
            dispatchForm({ type: 'CLEAR' });
        }
    }, [isFormReadyToSubmit]);

    // добавляем фильтрацию по контексту
    useEffect(() => {
        dispatchForm({
            type: 'SET_VALUE',
            payload: { userId },
        });
    }, [userId]);

    // на изменение просходит очистка значений формы, dispatch отрабатывает при каждом изменении поля input
    const onChange = (e) => {
        dispatchForm({
            type: 'SET_VALUE',
            payload: { [e.target.name]: e.target.value },
        });
    };

    // отрабатывает действие при нажатии на кнопку
    const addJournalItem = (e) => {
        e.preventDefault();

        // получение данных html формы в виде объекта
        // const formData = new FormData(e.target);
        // const formProps = Object.fromEntries(formData);
        // console.log(formProps)
        dispatchForm({ type: 'SUBMIT' });
    };

    return (
        <form className={styles['journal-form']} onSubmit={addJournalItem}>
            <div className={styles['title-box']}>
                <input
                    ref={titleRef}
                    value={values.title}
                    onChange={onChange}
                    type="title"
                    name="title"
                    className={`${styles['title']} ${
                        isValid.date ? '' : styles['invalid']
                    }`}
                    placeholder="Введите заголовок"
                />
            </div>
            <div className={styles['form-row']}>
                <label htmlFor="date" className={styles['form-labels']}>
                    <img
                        src="/calendar.svg"
                        alt="calendar_logo"
                        className={styles.date_logo}
                    />
                    <span>Дата</span>
                </label>
                <input
                    ref={dateRef}
                    value={values.date}
                    onChange={onChange}
                    type="date"
                    name="date"
                    id="date"
                    className={`${styles['date']} ${
                        isValid.date ? '' : styles['invalid']
                    }`}
                />
            </div>
            <div className={styles['form-row']}>
                <label htmlFor="tag" className={styles['form-labels']}>
                    <img
                        src="/tag.svg"
                        alt="tag_logo"
                        className={styles.tag_logo}
                    />
                    <span>Метки</span>
                </label>
                <input
                    onChange={onChange}
                    value={values.text}
                    type="text"
                    name="tag"
                    id="tag"
                    className={`${styles['tag']} ${
                        isValid.date ? '' : styles['invalid']
                    }`}
                    placeholder="Введите метку"
                />
            </div>
            <textarea
                ref={postRef}
                onChange={onChange}
                value={values.post}
                name="post"
                id=""
                cols="30"
                rows="10"
                className={`${styles['post_txt']} ${
                    isValid.post ? '' : styles['invalid']
                }`}
                placeholder="Введите текст"
            ></textarea>
            <Button
                text="Сохранить"
                // onClick={() => {
                //     console.log('pressed');
                // }}
            />
        </form>
    );
}
export default JournalForm;