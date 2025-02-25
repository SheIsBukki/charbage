import { EditorContext } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import React, { useContext } from "react";
import { ControllerRenderProps } from "react-hook-form";
import rehypeSanitize from "rehype-sanitize";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { MdHelpOutline, MdOutlineEdit } from "react-icons/md";
// import { uploadImage } from "@/utils/uploadImage";

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
        className="items-caenter flex justify-between space-x-2 rounded-lg px-4 py-2 hover:bg-gray-500 md:text-lg"
        onClick={click}
      >
        <MdOutlineEdit className="md:size-5" />
        <span>Edit</span>
      </p>
    );
  };

  const codePreview = {
    name: "preview",
    keyCommand: "preview",
    value: "preview",
    icon: <CustomPreviewButton />,
  };

  const CustomHelpButton = () => {
    const { preview, dispatch } = useContext(EditorContext);
    return (
      <button disabled={preview === "preview"}>
        <p className="flex items-center justify-between space-x-2 text-gray-400 hover:text-blue-500">
          <MdHelpOutline />
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

  return (
    <>
      <MDEditor
        preview="edit"
        commands={[customHelp]}
        extraCommands={[codePreview]}
        data-color-mode="dark"
        previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
        aria-describedby="markdown-error"
        visibleDragbar={false}
        className="!rounded-lg"
        {...field}
        value={field.value}
        onChange={(value) => field.onChange(value)}
        style={{ height: "80vh", whiteSpace: "pre-wrap" }}
        aria-placeholder="Start writing markdown..."
        textareaProps={{
          placeholder: "Start writing markdown...",
          // onPaste: handlePaste,
          // onPaste: (file) => uploadImage(file),
          // onDrop: (file) => uploadImage(file),
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

/**
 * const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const blob = items[i].getAsFile();
        if (blob) {
          const formData = new FormData();
          formData.append("file", blob);
          try {
            const response = await fetch("/api/cloudinary/upload", {
              method: "POST",
              body: formData,
            });
            const data = await response.json();
            handleImageUpload(data.url);
          } catch (error) {
            console.error("Error uploading pasted image:", error);
          }
        }
        break;
      }
    }
  };
 * */

/**
 * const handleImageUpload = useCallback(
    (url: string) => {
      const imageMarkdown = `![Uploaded Image](${url})`;
      field.onChange((prevValue: string) => prevValue + "\n" + imageMarkdown);
    },
    [field],
  );

  const CustomImageUploadButton = () => {
    <UploadButton<OurFileRouter, "imageUploader">
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (res && res[0]) {
          handleImageUpload(res[0].url);
        }
      }}
      onUploadError={(error: Error) => {
        console.error("Error uploading image:", error);
      }}
    />;

    return <span>Upload</span>;
  };

  const customUpload = {
    name: "upload",
    keyCommand: "upload",
    value: "upload",
    icon: <CustomImageUploadButton />,
  };
 * */
