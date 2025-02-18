import editorDarkCss from "@/app/utils/editorDarkCss";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import React, { useEffect } from "react";
import { ControllerRenderProps } from "react-hook-form";

export default function MarkdownEditor({ ...field }: ControllerRenderProps) {
  const { theme } = useTheme();

  useEffect(() => {
    const customStyle = document.createElement("style");
    customStyle.classList.add("editor-dark-theme");
    customStyle.innerHTML = editorDarkCss;
    const existingStyle = document.querySelector(".editor-dark-theme");

    if (theme === "dark") {
      if (!existingStyle) {
        document.head.appendChild(customStyle);
      }
    } else {
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    }
  }, [theme]);

  return (
    <>
      <MDEditor
        aria-describedby="markdown-error"
        visibleDragbar={false}
        className="!rounded-lg"
        {...field}
        value={field.value}
        onChange={(value) => field.onChange(value)}
        style={{ height: "80vh", whiteSpace: "pre-wrap" }}
        aria-placeholder="Start writing markdown..."
        textareaProps={{ placeholder: "Start writing markdown..." }}
      />
    </>
  );
}

// "use client";

// import editorDarkCss from "@/app/utils/editorDarkCss";
// import md from "@/app/utils/md";
// import MDEditor from "@uiw/react-md-editor";
// import { useTheme } from "next-themes";
// import React, { useEffect, useState } from "react";
// // import { Interweave } from "interweave";

// export default function MarkdownEditor() {
//   const [markdownContent, setMarkdownContent] = useState("");

//   const { theme } = useTheme();

//   useEffect(() => {
//     const customStyle = document.createElement("style");
//     customStyle.classList.add("editor-dark-theme");
//     customStyle.innerHTML = editorDarkCss;
//     const existingStyle = document.querySelector(".editor-dark-theme");

//     if (theme === "dark") {
//       if (!existingStyle) {
//         document.head.appendChild(customStyle);
//       }
//     } else {
//       if (existingStyle) {
//         document.head.removeChild(existingStyle);
//       }
//     }
//   }, [theme]);

//   return (
//     <>
//       <MDEditor
//         aria-describedby="markdown-error"
//         visibleDragbar={false}
//         className="!rounded-lg"
//         value={markdownContent}
//         onChange={(text) => setMarkdownContent(text ?? "")}
//         style={{ height: "80vh", whiteSpace: "pre-wrap" }}
//         aria-placeholder="Start writing markdown..."
//         textareaProps={{ placeholder: "Start writing markdown..." }}
//       />

//       {/*<MDEditor.Markdown
//         source={md.render(markdownContent)}
//         style={{ whiteSpace: "pre-wrap" }}
//       />*/}

//       {/*<Interweave content={md.render(markdownContent)} />*/}
//     </>
//   );
// }
