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
        onClick={() => handlePaste}
        aria-roledescription="Upload image button"
        disabled={preview === "preview"}
        className="text-gray-400 hover:text-blue-500"
      >
        <FaImage className="md:size-5" />
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

      try {
        const imageUrl = await uploadImage(imageFile);
        const markdownImage = `![Replace with Alt text](${imageUrl})`;

        document.execCommand("insertText", false, markdownImage);

        // Attempt to write the code above using Clipboard API—only writeText() works for, the paste doesn't kick off automatically. No permision on Safari and Chrome will ask for permission but still doesn't paste automatically
        // await navigator.clipboard.writeText(markdownImage);
        // await navigator.clipboard.readText();
      } catch (error) {
        document.execCommand(
          "insertText",
          false,
          "ERROR: Image has not been stored on server",
        );

        console.error("Image upload failed:", error);

        // if ("clipboard" in navigator && "writeText" in navigator.clipboard) {
        //   await navigator.clipboard.writeText(
        //     "ERROR: Image has not been stored on server",
        //   );
        // }
      }
    }
  };

  return (
    <>
      <MDEditor
        id="editorTextArea"
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
        // onPaste={}
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
