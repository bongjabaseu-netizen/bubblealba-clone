/** 이미지 업로드 컴포넌트 — 드래그앤드롭 + 미리보기 */
"use client";

import { useState, useRef } from "react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  placeholder?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "banners",
  label,
  placeholder = "클릭하거나 드래그해서 이미지 업로드",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("파일 크기는 10MB 이하여야 합니다");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "업로드 실패");

      onChange(data.url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm text-slate-600">{label}</label>}

      {value ? (
        // 이미지 미리보기
        <div className="relative">
          <img
            src={value}
            alt="업로드된 이미지"
            className="w-full max-w-xs rounded-lg border border-slate-200"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-xs text-blue-500 hover:text-blue-600"
              disabled={uploading}
            >
              이미지 변경
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-red-500 hover:text-red-600"
              disabled={uploading}
            >
              이미지 삭제
            </button>
          </div>
        </div>
      ) : (
        // 업로드 영역
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-blue-500 bg-blue-50"
              : uploading
                ? "border-slate-300 bg-slate-50 cursor-wait"
                : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          {uploading ? (
            <div>
              <div className="text-2xl mb-2">⏳</div>
              <p className="text-sm text-slate-600">업로드 중...</p>
            </div>
          ) : (
            <div>
              <div className="text-2xl mb-2">📷</div>
              <p className="text-sm text-slate-700">{placeholder}</p>
              <p className="text-xs text-slate-400 mt-1">최대 10MB · JPG, PNG, WebP</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
