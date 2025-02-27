import { EditorContext } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import React, { useContext } from "react";
import { ControllerRenderProps } from "react-hook-form";
import rehypeSanitize from "rehype-sanitize";
import Link from "next/link";
import { FaEye, FaImage } from "react-icons/fa";
import { MdHelpOutline, MdOutlineEdit } from "react-icons/md";
import { uploadImage } from "@/utils/uploadImage";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function MarkdownEditor({ ...field }: ControllerRenderProps) {
  const CustomPreviewButton = () => {
    const { preview, dispatch } = useContext(EditorContext);
    const click = () => {
      if (dispatch) {
        dispatch({ preview: preview === "edit" ? "preview" : "edit" });
      }
    };

    if (preview === "edit") {
      return (
        <p
          aria-roledescription="Preview button"
          className="flex items-center justify-between space-x-2 rounded-lg px-4 py-2 hover:bg-gray-500 md:text-lg"
          onClick={click}
        >
          <FaEye className="md:size-5" />
          <span>Preview</span>
        </p>
      );
    }
    return (
      <p
        aria-roledescription="Edit button"
        className="flex items-center justify-between space-x-2 rounded-lg px-4 py-2 hover:bg-gray-500 md:text-lg"
        onClick={click}
      >
        <MdOutlineEdit className="md:size-5" />
        <span>Edit</span>
      </p>
    );
  };

  const customPreview = {
    name: "preview",
    keyCommand: "preview",
    value: "preview",
    icon: <CustomPreviewButton />,
  };

  const CustomHelpButton = () => {
    const { preview, dispatch } = useContext(EditorContext);
    return (
      <button disabled={preview === "preview"}>
        <p className="flex items-center justify-between space-x-1 text-gray-400 hover:text-blue-500 md:text-lg">
          <MdHelpOutline className="md:size-5" />
          <Link
            target="_blank"
            href="https://www.markdownguide.org/basic-syntax"
          >
            Help
          </Link>
        </p>
      </button>
    );
  };

  const customHelp = {
    name: "help",
    keyCommand: "help",
    value: "help",
    icon: <CustomHelpButton />,
  };

  const CustomUploadButton = () => {
    const { preview, dispatch } = useContext(EditorContext);
    return (
      <button
        // onClick={}
        aria-roledescription="Upload button"
        disabled={preview === "preview"}
      >
        <FaImage className="text-gray-400 hover:text-blue-500 md:size-5" />
      </button>
    );
  };

  const customUpload = {
    name: "upload",
    keyCommand: "upload",
    value: "upload",
    icon: <CustomUploadButton />,
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const clipboardData = event.clipboardData;

    if (clipboardData.files.length === 1) {
      event.preventDefault();
      const imageFile = clipboardData.files[0] as File;

      const imageUrl = await uploadImage(imageFile);

      if (imageUrl) {
        const markdownImage = `![Replace with Alt text](${imageUrl})`;

        // if (window.isSecureContext && navigator.clipboard) {
        //   navigator.clipboard.writeText(markdownImage);
        // }
        if ("clipboard" in navigator && "writeText" in navigator.clipboard) {
          navigator.clipboard.writeText(markdownImage);
        } else {
          document.execCommand("insertText", false, markdownImage);
        }
      } else {
        // if (window.isSecureContext) {
        //   navigator.clipboard.writeText(
        //     "ERROR: Image has not been stored on server",
        //   );
        // }
        if ("clipboard" in navigator && "writeText" in navigator.clipboard) {
          navigator.clipboard.writeText(
            "ERROR: Image has not been stored on server",
          );
        } else {
          document.execCommand(
            // "insertHTML", // this Inserts an HTML string at the insertion point (deletes selection). Requires a valid HTML string as a value argument., so I'm not sure whether I should use it
            "insertText", // this inserts plain text as is
            false,
            "ERROR Image has not been stored on server",
          );
        }
      }
    }
  };

  return (
    <>
      <MDEditor
        preview="edit"
        commands={[customHelp, customUpload]}
        extraCommands={[customPreview]}
        data-color-mode="dark"
        previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
        aria-describedby="markdown-error"
        visibleDragbar={false}
        className="!rounded-lg"
        {...field}
        value={field.value}
        onChange={(value) => field.onChange(value)}
        // onPaste={handlePaste}
        style={{ height: "80vh", whiteSpace: "pre-wrap" }}
        aria-placeholder="Start writing markdown..."
        textareaProps={{
          placeholder: "Start writing markdown...",
          onPaste: handlePaste,
        }}
      />
    </>
  );
}

/** windown.isSecureContext Temporary Button
 * const temporaryButton = document.createElement("button");
          temporaryButton.textContent = "Insert image";
          temporaryButton.onclick = () => {
            navigator.clipboard.writeText(markdownImage);
          };
          document.body.appendChild(temporaryButton);
          temporaryButton.click();
          document.body.removeChild(temporaryButton);
 * */

/** This is REQUIRED for approaches that use useRef()
 * const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Create a ref for the textarea— this actually returns null so this useRef() approach probably doesn't work
 * */

/**
  // APPROACH 2 OG Code that works but prepends the image URL to the existing content/
 const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();

        if (file) {
          event.preventDefault();
          // console.log(file.name);
          try {
            const imageUrl = await uploadImage(file);
            const markdownImage = `![Replace with Alt text](${imageUrl}) `; // Markdown syntax for images
            // Get the current markdown content
            const existingContent = field.value || "";

            const start = textareaRef.current?.selectionStart || 0; // Cursor position
            const end = textareaRef.current?.selectionEnd || 0; // End of selection

            // Insert the image markdown at the cursor position — it actually prepends the markdown image to the existing content
            const updatedContent =
              existingContent.slice(0, start) +
              markdownImage +
              existingContent.slice(end);

            field.onChange(updatedContent);

            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.selectionStart =
                  textareaRef.current.selectionEnd =
                    start! + markdownImage.length;
                textareaRef.current.focus();
              }
            }, 0);
          } catch (error) {
            console.error("Image upload failed:", error);
          }
        }
      }
    }
  };
 * */

/**
 * // TWO DIFFERENT APPROACHS: APPROACH 1
  const handlePaste = async (event: React.ClipboardEvent) => {
    const clipboardData = event.clipboardData;
    if (clipboardData.files.length === 1) {
      const imageFile = clipboardData.files[0] as File;
      // console.log(imageFile.name);
      const imageUrl = await uploadImage(imageFile);
      console.log(imageUrl);
      event.preventDefault();

      try {
        // const imageUrl = await uploadImage(imageFile);
        const markdownImage = `![Replace with Alt text](${imageUrl}) `; // Markdown syntax for images
        // Get the current markdown content
        const existingContent = field.value || "";
        // field.onChange(existingContent + markdownImage); // Append the image markdown to the current value

        // This approach prepends the markdown image to the existing content
        const start = textareaRef.current?.selectionStart || 0; // Cursor position
        const end = textareaRef.current?.selectionEnd || 0; // End of selection

        // Insert the image markdown at the cursor position
        const updatedContent =
          existingContent.slice(0, start) +
          markdownImage +
          existingContent.slice(end);

        field.onChange(updatedContent); // Append the image markdown to the current value

        // Move the cursor to the end of the inserted image markdown
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart =
              textareaRef.current.selectionEnd = start! + markdownImage.length;
            textareaRef.current.focus();
          }
        }, 0);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };
 * */

/**
 * // THE REAL OG Code that appends the image URL to the existing content/
  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();

        if (file) {
          event.preventDefault();
          // console.log(file.name);
          try {
            const imageUrl = await uploadImage(file);
            const markdownImage = `![Replace with Alt text](${imageUrl}) `; // Markdown syntax for images
            // Get the current markdown content
            const existingContent = field.value || "";
            field.onChange(existingContent + markdownImage); // Append the image markdown to the current value
          } catch (error) {
            console.error("Image upload failed:", error);
          }
        }
      }
    }
  };
 * */

/** WITHOUT useRef() — it returns error
  //            * Instead of appending the markdwon image to the currentValue, we can place it at the current cursor position of the user, hence we Get the cursor position

  //           const textarea = event.currentTarget; // Reference to the textarea— this actually returns null so this without useRef() approach doesn't work

  //           const start = textarea.selectionStart; // Cursor position
  //           const end = textarea.selectionEnd; // End of selection

  //           // Insert the image markdown at the cursor position
  //           const updatedContent =
  //             existingContent.slice(0, start) +
  //             markdownImage +
  //             existingContent.slice(end);

  //           field.onChange(updatedContent); // Append the image markdown to the current value

  //           //Without useRef() setTimeout() Move the cursor to the end of the inserted image markdown
  //           setTimeout(() => {
  //             textarea.selectionStart = textarea.selectionEnd =
  //               start + markdownImage.length;
  //             textarea.focus();
  //           }, 0);
        */

/**
 *
"use client";

import editorDarkCss from "@/app/utils/editorDarkCss";
import md from "@/app/utils/md";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
// import { Interweave } from "interweave";

export default function MarkdownEditor() {
  const [markdownContent, setMarkdownContent] = useState("");

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
        value={content}
        onChange={(text) => setMarkdownContent(text ?? "")}
        style={{ height: "80vh", whiteSpace: "pre-wrap" }}
        aria-placeholder="Start writing markdown..."
        textareaProps={{ placeholder: "Start writing markdown..." }}
      />

    // These two are alternatives
      <MDEditor.Markdown
        source={md.render(ontent)}
        style={{ whiteSpace: "pre-wrap" }}
      />

      <Interweave content={md.render(content)} />
    </>
  );
}
 * */
