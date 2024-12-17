"use client";

import { useState } from "react";
import style from "./modal.scss";

type TModal = {
    text: string;
    isShowModal: boolean;
}

const Modal = ({text, isShowModal}:TModal) => {

    const [isOpen, setIsOpen] = useState(true);

    const onClickCloseBtn = () => {
        setIsOpen(false);
    }

    return (
        isOpen && (
            <div className={style.modal_wrap}>
                <div className={style.modal_area}>
                    <div className={style.header}>
                        <button type="button" onClick={onClickCloseBtn}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" className={style.svg}><path d="m6 6 20 20M26 6 6 26"></path></svg>
                        </button>
                        {text}
                    </div>
                </div>
            </div>
        )
    )
}

export default Modal;