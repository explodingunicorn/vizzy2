import styled from "styled-components";

export const Button = styled.button`
  padding: 0.5rem 2rem;
  border-radius: var(--border-radius);
  background-color: var(--colors-green);
  color: var(--colors-opaque-dark);
  font-family: "Outfit";
  font-size: 12px;
  letter-spacing: 2px;
  font-weight: 700;
  text-transform: uppercase;
  outline: none;
  border: none;
  text-decoration: none;

  &:hover {
    background-color: var(--colors-green-dark);
  }
`;
