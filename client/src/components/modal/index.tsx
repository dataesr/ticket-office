import { useEffect, useId, useRef } from "react";

type ModalSize = "sm" | "md" | "lg" | "xl";

const SIZE_COL: Record<ModalSize, number> = { sm: 4, md: 6, lg: 8, xl: 10 };

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  size?: ModalSize;
  children: React.ReactNode;
  className?: string;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  className,
}: ModalProps) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.classList.toggle("fr-modal--opened", isOpen);
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onNativeClose = () => onClose();
    dialog.addEventListener("close", onNativeClose);
    return () => dialog.removeEventListener("close", onNativeClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      id={id}
      className={["fr-modal", className].filter(Boolean).join(" ")}
      role="dialog"
      aria-labelledby={`${id}-title`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="fr-container fr-container--fluid fr-container-md">
        <div className="fr-grid-row fr-grid-row--center">
          <div className={`fr-col-12 fr-col-md-${SIZE_COL[size]}`}>
            <div className="fr-modal__body">
              <div className="fr-modal__header">
                <button
                  type="button"
                  className="fr-btn--close fr-btn"
                  title="Fermer"
                  onClick={onClose}
                >
                  Fermer
                </button>
              </div>
              <div className="fr-modal__content">
                <h1 id={`${id}-title`} className="fr-modal__title">
                  {title}
                </h1>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
