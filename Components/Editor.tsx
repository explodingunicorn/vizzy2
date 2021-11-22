import styled from "styled-components";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { useEffect, useState } from "react";

const EditorContainer = styled.div`
  position: fixed;
  height: 90vw;
  right: 2rem;
  top: 5vw;
  padding: 1rem;
  opacity: 0.7;
`;

export const LiveEditor = ({
  onCodeChange,
}: {
  onCodeChange: (code: string) => void;
}) => {
  const [code, setCode] = useState(
    () => `
    (data, s) => {
      s.clear();
      s.ellipse(data.width / 2, data.height / 2, 100 * data.pitch, 100 * data.pitch);
    }
  `
  );
  console.log(highlight);

  useEffect(() => {
    let evaledCode;
    try {
      evaledCode = eval(code);
    } catch (e) {}
    if (evaledCode) {
      onCodeChange(`
        (data, s) => {
          try {
            (${code})(data, s);
          } catch(e) { }
        }`);
    }
  }, [code]);

  return (
    <EditorContainer>
      <Editor
        value={code}
        onValueChange={setCode}
        highlight={(code) => highlight(code, languages.js)}
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
