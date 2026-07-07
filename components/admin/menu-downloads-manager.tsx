"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Check, FileText, Trash2 } from "lucide-react";

import { deleteMenuDownload, saveMenuDownload } from "@/lib/menu-actions";
import type { MenuDownloadData } from "@/lib/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Must match the server cap in lib/menu-actions.ts (base64 characters).
const MAX_DOWNLOAD_CHARS = 8_000_000;
const ACCEPT = ".pdf,image/png,image/jpeg,image/webp";

/** Read a file as a base64 data URL (no downscaling — PDFs are stored as-is). */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function DeleteButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      disabled={pending}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 className="size-4" />
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function MenuDownloadsManager({
  downloads,
}: {
  downloads: MenuDownloadData[];
}) {
  const t = useTranslations("menu.admin");
  const [state, formAction, pending] = useActionState(
    saveMenuDownload,
    undefined,
  );

  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [clientError, setClientError] = useState<
    "tooLarge" | "invalidFile" | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handledSave = useRef<string | null>(null);

  function resetForm() {
    setTitle("");
    setFile("");
    setFileName("");
    setClientError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setClientError(null);
    try {
      const dataUrl = await fileToDataUrl(picked);
      if (dataUrl.length > MAX_DOWNLOAD_CHARS) {
        setClientError("tooLarge");
        setFile("");
        setFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setFile(dataUrl);
      setFileName(picked.name);
      // Default the label to the filename (without extension) if still blank.
      if (!title.trim()) {
        setTitle(picked.name.replace(/\.[^.]+$/, ""));
      }
    } catch {
      setClientError("invalidFile");
    }
  }

  // After a successful create, clear the form so the next file can be added.
  useEffect(() => {
    if (state?.status === "saved" && handledSave.current !== state.id) {
      handledSave.current = state.id;
      resetForm();
    }
  }, [state]);

  const serverError =
    state?.status === "error"
      ? state.reason === "tooLarge"
        ? t("downloads.tooLarge")
        : state.reason === "invalidFile"
          ? t("downloads.invalidFile")
          : t("error")
      : null;
  const errorMessage =
    clientError === "tooLarge"
      ? t("downloads.tooLarge")
      : clientError === "invalidFile"
        ? t("downloads.invalidFile")
        : serverError;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-espresso">
          {t("downloads.heading")}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("downloads.subtitle")}
        </p>
      </div>

      {/* Existing files */}
      {downloads.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("downloads.empty")}</p>
      ) : (
        <ul className="space-y-2">
          {downloads.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-2.5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-oat text-clay">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{d.title}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {d.fileName}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <a
                  href={`/api/menu-download/${d.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center rounded-md px-3 text-sm font-medium text-espresso hover:bg-oat"
                >
                  {t("downloads.view")}
                </a>
                <form
                  action={deleteMenuDownload}
                  onSubmit={(e) => {
                    if (!window.confirm(t("downloads.deleteConfirm")))
                      e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={d.id} />
                  <DeleteButton
                    label={t("delete")}
                    pendingLabel={t("deleting")}
                  />
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add a file */}
      <form
        action={formAction}
        className="space-y-5 rounded-lg border border-border bg-card p-4"
      >
        <input type="hidden" name="file" value={file} />
        <input type="hidden" name="fileName" value={fileName} />

        <h4 className="font-medium text-espresso">
          {t("downloads.newDownload")}
        </h4>

        <div className="space-y-2">
          <Label htmlFor="download-title">{t("downloads.titleLabel")}</Label>
          <Input
            id="download-title"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("downloads.titlePlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("downloads.fileLabel")}</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            onChange={onFileChange}
            className="hidden"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? t("downloads.changeFile") : t("downloads.chooseFile")}
            </Button>
            <span className="min-w-0 truncate text-sm text-muted-foreground">
              {fileName || t("downloads.noFile")}
            </span>
            {file && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFile("");
                  setFileName("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                {t("downloads.removeFile")}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("downloads.fileHint")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button type="submit" disabled={pending || !file}>
            {pending ? t("saving") : t("downloads.add")}
          </Button>
          {state?.status === "saved" && (
            <span className="flex items-center gap-1 text-sm text-espresso">
              <Check className="size-4" /> {t("saved")}
            </span>
          )}
          {errorMessage && (
            <span className="text-sm text-destructive">{errorMessage}</span>
          )}
        </div>
      </form>
    </div>
  );
}
