import { ReactNode } from "react";

import styles from "./modalStyles.module.css";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  hasHeader?: boolean;
}

export function Modal({ children, isOpen, closeModal }: ModalProps) {
  return (
    <>
      {isOpen && (
        <div className={styles.ModalContainer} onClick={closeModal}>
          <div
            className={styles.ModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
}
