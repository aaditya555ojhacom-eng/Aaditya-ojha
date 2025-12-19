import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

export default function RTE({
  name = "content",
  control,
  label,
  defaultValue = "",
  rules = {},
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm text-gray-600">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={value}
              onEditorChange={onChange}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic forecolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | removeformat | help",
              }}
            />

            {error && (
              <p className="text-red-500 text-sm mt-1">
                {error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}
