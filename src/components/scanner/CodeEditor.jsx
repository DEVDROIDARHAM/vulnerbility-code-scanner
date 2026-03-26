import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, onChange, language, height = "500px" }) => {
  const handleEditorWillMount = (monaco) => {
    // Define a custom theme that matches our Midnight Slate palette
    monaco.editor.defineTheme("scanSentinelDark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "64748b", fontStyle: "italic" },
        { token: "keyword", foreground: "6366f1", fontStyle: "bold" },
        { token: "string", foreground: "10b981" },
        { token: "number", foreground: "f59e0b" },
        { token: "type", foreground: "3b82f6" },
        { token: "function", foreground: "818cf8" },
      ],
      colors: {
        "editor.background": "#09090b",
        "editor.foreground": "#f1f5f9",
        "editorLineNumber.foreground": "#27272a",
        "editorLineNumber.activeForeground": "#e11d48",
        "editor.lineHighlightBackground": "#121216",
        "editor.selectionBackground": "#e11d4833",
        "editorCursor.foreground": "#e11d48",
        "editorWidget.background": "#121216",
        "editorWidget.border": "#27272a",
        "editorScrollbar.slider.background": "#27272a",
        "editorScrollbar.slider.hoverBackground": "#a1a1aa33",
        "editorScrollbar.slider.activeBackground": "#e11d4833",
      },
    });
  };

  return (
    <div className="w-full h-full bg-[#0f0f14] border-t lg:border-t-0 border-border overflow-hidden">
      <Editor
        height={height}
        defaultLanguage="javascript"
        language={language?.toLowerCase() || "javascript"}
        value={code}
        onChange={onChange}
        theme="scanSentinelDark"
        beforeMount={handleEditorWillMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'SF Mono', 'Monaco', 'Cascadia Code', 'monospace'",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 20 },
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 10,
          renderLineHighlight: "all",
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            useShadows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          // User requested: disable autocomplete/intellisense to focus on scanner
          suggestOnTriggerCharacters: false,
          quickSuggestions: false,
          snippetSuggestions: "none",
          wordBasedSuggestions: "off",
          parameterHints: { enabled: false },
        }}
      />
    </div>
  );
};

export default CodeEditor;
