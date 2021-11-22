import { MouseEvent, ReactNode } from "react";
import styled from "styled-components";

const StyledModal = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
`;

const StyledBackdrop = styled.div`
  align-items: center;
  background-color: var(--colors-opaque-dark);
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
`;

export const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode | ReactNode[];
}) => {
  return (
    <StyledBackdrop onClick={onClose}>
      <StyledModal onClick={(e: MouseEvent) => e.stopPropagation()}>
        {children}
      </StyledModal>
    </StyledBackdrop>
  );
};
