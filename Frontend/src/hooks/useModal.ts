import { useRef } from "react";

/*Specifies the hook data type result*/
type UseModalResult = {
    modalRef: React.RefObject<HTMLDialogElement>;
    backdropRef: React.RefObject<HTMLDivElement>;
    openModal: () => void;
    closeModal: () => void;
};
/*Creates a reusable hook for all the modals in the app*/
export const useModal = (): UseModalResult => {
    /*Targets the dialog and div tags*/
    const modalRef = useRef<HTMLDialogElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    /*Opens the modal and set the 'overflow-hidden' class to the body
    and removes the 'hidden' class of the div element*/
    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
            document.body.classList.add("overflow-hidden");
            backdropRef?.current?.classList.remove("hidden");
        }
    };
    /*Closes the modal, removes the 'overflow-hidden' class and adds the
    'hidden' class back to the div*/
    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close();
            document.body.classList.remove("overflow-hidden");
            backdropRef?.current?.classList.add("hidden");
        }
    };
    /*Finally returns the refs and both functions*/
    return { modalRef, backdropRef, openModal, closeModal };
};