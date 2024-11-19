import { useRef } from "react";

type UseModalResult = {
    modalRef: React.RefObject<HTMLDialogElement>;
    backdropRef: React.RefObject<HTMLDivElement>;
    openModal: () => void;
    closeModal: () => void;
};

export const useModal = (): UseModalResult => {

    const modalRef = useRef<HTMLDialogElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
            document.body.classList.add("overflow-hidden");
            backdropRef?.current?.classList.remove("hidden");
        }
    };

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close();
            document.body.classList.remove("overflow-hidden");
            backdropRef?.current?.classList.add("hidden");
        }
    };

    return { modalRef, backdropRef, openModal, closeModal };
};