import styled from "styled-components";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prism-themes/themes/prism-a11y-dark.css";
import { useEffect, useState } from "react";

const EditorContainer = styled.div`
  background-color: var(--colors-very-opaque-dark);
  border-radius: var(--border-radius);
  color: var(--colors-white);
  position: absolute;
  right: 1rem;
  top: 1rem;
  bottom: 1rem;
  padding: 1rem;
`;

export const LiveEditor = ({
  onCodeChange,
}: {
  onCodeChange: (code: string) => void;
}) => {
  const [code, setCode] = useState(
    () => `
    function draw(data, p) {
      p.clear();
      p.noStroke();
      p.rectMode(p.CENTER)
      p.fill(p.color(0, 0, 255, 100));
      p.ellipse(data.width / 2 - 200, data.height / 2, 100 * data.pitch, 100 * data.pitch);
      p.fill(p.color(255, 255, 0, 100))
      p.rect(data.width / 2, data.height / 2, 100 * data.pitch, 100 * data.pitch);
      p.fill(p.color(255, 0, 0, 100));
      p.ellipse(data.width / 2 + 200, data.height / 2, 100 * data.pitch, 100 * data.pitch);
    }
  `
  );

  useEffect(() => {
    let evaledCode;
    const fullCode = `
      (data, p) => {
        try {
          ${code}
          draw(data, p);
        } catch(e) { console.log(e) }
      }`;
    try {
      evaledCode = eval(fullCode);
    } catch (e) {}
    if (evaledCode) {
      onCodeChange(fullCode);
    }
  }, [code]);

  return (
    <EditorContainer>
      <Editor
        value={code}
        onValueChange={setCode}
        highlight={(code) => highlight(code, languages.javascript)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
    </EditorContainer>
  );
};

export default LiveEditor;
