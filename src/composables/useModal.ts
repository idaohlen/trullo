import { ref, provide, inject, type Ref } from "vue";

type ModalType = 
  "CreateTask" 
| "CreateProject" 
| "EditUser" 
| "TaskDetails"
| "Confirmation"
| null;

type ModalPayload = any;

interface ModalContext {
  modalType: Ref<ModalType>;
  modalPayload: Ref<ModalPayload>;
  openModal: (type: ModalType, payload?: ModalPayload) => void;
  closeModal: () => void;
}

const ModalSymbol = Symbol("ModalContext");

export function provideModal() {
  const modalType = ref<ModalType>(null);
  const modalPayload = ref<ModalPayload>(null);

  function openModal(type: ModalType, payload?: ModalPayload) {
    modalType.value = type;
    modalPayload.value = payload ?? null;
  }
  function closeModal() {
    modalType.value = null;
    modalPayload.value = null;
  }

  provide(ModalSymbol, {
    modalType,
    modalPayload,
    openModal,
    closeModal,
  });
}

export function useModal(): ModalContext {
  const context = inject<ModalContext>(ModalSymbol);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
}
